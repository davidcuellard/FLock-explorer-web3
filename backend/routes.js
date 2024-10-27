const express = require("express");
const router = express.Router();
const { TaskManagerContract } = require("./contracts");

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });

function paginate(array, page, limit) {
  const startIndex = (page - 1) * limit;
  return array.slice(startIndex, startIndex + limit);
}

router.get("/nodes", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const cacheKey = `nodes:page:${page}:limit:${limit}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const nodeDepositFilter = TaskManagerContract.filters.NodeStakeDeposited();
    const nodeDepositEvents = await TaskManagerContract.queryFilter(
      nodeDepositFilter,
      0,
      "latest"
    );

    const nodes = new Set();
    nodeDepositEvents.forEach((event) => {
      nodes.add(event.args[1]);
    });
    const nodeAddresses = Array.from(nodes);

    const rewardsFilter = TaskManagerContract.filters.RewardsClaimed();
    const rewardsEvents = await TaskManagerContract.queryFilter(
      rewardsFilter,
      0,
      "latest"
    );

    const nodeRewardsMap = {};
    rewardsEvents.forEach((event) => {
      const nodeAddress = event.args[0];
      const amount = BigInt(event.args[1]);

      if (nodeRewardsMap[nodeAddress]) {
        nodeRewardsMap[nodeAddress] += amount;
      } else {
        nodeRewardsMap[nodeAddress] = amount;
      }
    });

    const sortedNodes = nodeAddresses.sort((a, b) => {
      const rewardsA = nodeRewardsMap[a] || BigInt(0);
      const rewardsB = nodeRewardsMap[b] || BigInt(0);

      if (rewardsA > rewardsB) return -1;
      if (rewardsA < rewardsB) return 1;
      return 0;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNodeAddresses = sortedNodes.slice(startIndex, endIndex);

    const nodesData = await Promise.all(
      paginatedNodeAddresses.map(async (nodeAddress) => {
        let totalStakes = "0";
        try {
          totalStakes = (
            await TaskManagerContract.getTotalStakes(nodeAddress)
          ).toString();
        } catch (error) {
          console.error(
            `Error fetching total stakes for node ${nodeAddress}:`,
            error
          );
        }
        return {
          address: nodeAddress,
          rewardAmount: (nodeRewardsMap[nodeAddress] || BigInt(0)).toString(),
          totalStakes,
        };
      })
    );

    cache.set(cacheKey, nodesData);

    res.json(nodesData);
  } catch (error) {
    console.error("Error fetching nodes:", error);
    res
      .status(500)
      .json({ error: "Error fetching nodes", details: error.message });
  }
});

router.get("/nodes/:id", async (req, res) => {
  const nodeId = req.params.id;

  try {
    const totalStakes = await TaskManagerContract.getTotalStakes(nodeId);
    const rewardAmount = await TaskManagerContract.userRewards(nodeId);
    const availableRewardTasksForUser =
      await TaskManagerContract.getAvailableRewardTasksForUser(nodeId);
    const taskIds = await TaskManagerContract.getNodeTasks(nodeId);
    const taskStakeDetails = await Promise.all(
      taskIds.map(async (taskId) => {
        const nodeStake = await TaskManagerContract.getNodeStakes(
          taskId,
          nodeId
        );
        return {
          taskId: taskId.toString(),
          nodeStake: nodeStake.toString(),
        };
      })
    );

    const depositFilter = TaskManagerContract.filters.NodeStakeDeposited(
      null,
      nodeId
    );
    const depositEvents = await TaskManagerContract.queryFilter(
      depositFilter,
      0,
      "latest"
    );

    const deposits = depositEvents.map((event) => ({
      blockNumber: event.blockNumber,
      taskId: event.args[0].toString(),
      nodeAddress: event.args[1],
      amount: event.args[2].toString(),
    }));

    const withdrawFilter = TaskManagerContract.filters.NodeStakeWithdrawn(
      null,
      nodeId
    );
    const withdrawEvents = await TaskManagerContract.queryFilter(
      withdrawFilter,
      0,
      "latest"
    );

    const withdrawals = withdrawEvents.map((event) => ({
      blockNumber: event.blockNumber,
      taskId: event.args[0].toString(),
      nodeAddress: event.args[1],
      amount: event.args[2].toString(),
    }));

    const rewardsClaimedFilter =
      TaskManagerContract.filters.RewardsClaimed(nodeId);
    const rewardsClaimedEvents = await TaskManagerContract.queryFilter(
      rewardsClaimedFilter,
      0,
      "latest"
    );

    const rewardsClaimed = rewardsClaimedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      nodeAddress: event.args[0],
      amount: event.args[1].toString(),
    }));

    res.json({
      address: nodeId,
      totalStakes: totalStakes.toString(),
      rewardAmount: rewardAmount.toString(),
      availableRewardTasksForUser: availableRewardTasksForUser.map((id) =>
        id.toString()
      ),
      taskStakeDetails,
      deposits,
      withdrawals,
      rewardsClaimed,
    });
  } catch (error) {
    console.error("Error fetching node details:", error);
    res.status(500).json({
      error: "Error fetching node details",
      details: error.message,
    });
  }
});

router.get("/validators", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const stakeFilter = TaskManagerContract.filters.ValidatorStakeDeposited();
    const stakeEvents = await TaskManagerContract.queryFilter(
      stakeFilter,
      0,
      "latest"
    );

    const validatorAddressesWithStakes = new Set(
      stakeEvents.map((event) => event.args.validator)
    );

    const rewardsClaimedFilter = TaskManagerContract.filters.RewardsClaimed();
    const rewardsClaimedEvents = await TaskManagerContract.queryFilter(
      rewardsClaimedFilter,
      0,
      "latest"
    );

    const rewardsMap = new Map();
    rewardsClaimedEvents.forEach((event) => {
      const validatorAddress = event.args[0];
      const rewardAmount = BigInt(event.args[1]);

      if (validatorAddressesWithStakes.has(validatorAddress)) {
        if (rewardsMap.has(validatorAddress)) {
          rewardsMap.set(
            validatorAddress,
            rewardsMap.get(validatorAddress) + rewardAmount
          );
        } else {
          rewardsMap.set(validatorAddress, rewardAmount);
        }
      }
    });

    let validatorsArray = Array.from(rewardsMap, ([address, rewardAmount]) => ({
      address,
      rewardAmount,
    }));

    validatorsArray.sort((a, b) => (b.rewardAmount > a.rewardAmount ? 1 : -1));

    const paginatedValidators = validatorsArray.slice(
      (page - 1) * limit,
      page * limit
    );

    const validatorsData = await Promise.all(
      paginatedValidators.map(async (validator) => {
        let totalStakes = "0";
        try {
          const validatorStake = await TaskManagerContract.getTotalStakes(
            validator.address
          );
          totalStakes = validatorStake.toString();
        } catch (error) {
          console.error(
            `Error fetching total stakes for validator ${validator.address}:`,
            error
          );
        }

        return {
          address: validator.address,
          rewardAmount: validator.rewardAmount.toString(),
          totalStakes,
        };
      })
    );

    res.json(validatorsData);
  } catch (error) {
    console.error("Error fetching validators:", error);
    res
      .status(500)
      .json({ error: "Error fetching validators", details: error.message });
  }
});

router.get("/validators/:id", async (req, res) => {
  const validatorId = req.params.id;
  try {
    const validatorStake = await TaskManagerContract.getTotalStakes(
      validatorId
    );
    const rewardAmount = await TaskManagerContract.userRewards(validatorId);
    const availableRewardTasksForUser =
      await TaskManagerContract.getAvailableRewardTasksForUser(validatorId);

    const validatorTasks = [];
    let index = 0;

    while (true) {
      try {
        const taskId = await TaskManagerContract.validatorTasks(
          validatorId,
          index
        );

        const validatorStake = await TaskManagerContract.getValidatorStakes(
          taskId,
          validatorId
        );

        validatorTasks.push({
          taskId: taskId.toString(),
          validatorStake: validatorStake.toString(),
        });

        index += 1;
      } catch (error) {
        break;
      }
    }

    const depositsFilter = TaskManagerContract.filters.ValidatorStakeDeposited(
      null,
      validatorId
    );
    const deposits = await TaskManagerContract.queryFilter(
      depositsFilter,
      0,
      "latest"
    );

    const withdrawalsFilter =
      TaskManagerContract.filters.ValidatorStakeWithdrawn(null, validatorId);
    const withdrawals = await TaskManagerContract.queryFilter(
      withdrawalsFilter,
      0,
      "latest"
    );

    const depositsData = deposits.map((event) => ({
      blockNumber: event.blockNumber,
      taskId: event.args[0].toString(),
      validator: event.args[1],
      amount: event.args[2].toString(),
    }));

    const withdrawalsData = withdrawals.map((event) => ({
      blockNumber: event.blockNumber,
      taskId: event.args[0].toString(),
      validator: event.args[1],
      amount: event.args[2].toString(),
    }));

    const rewardsClaimedFilter =
      TaskManagerContract.filters.RewardsClaimed(validatorId);
    const rewardsClaimedEvents = await TaskManagerContract.queryFilter(
      rewardsClaimedFilter,
      0,
      "latest"
    );

    const rewardsClaimed = rewardsClaimedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      nodeAddress: event.args[0],
      amount: event.args[1].toString(),
    }));

    res.json({
      address: validatorId,
      totalStakes: validatorStake.toString(),
      rewardAmount: rewardAmount.toString(),
      availableRewardTasksForUser: availableRewardTasksForUser.map((id) =>
        id.toString()
      ),
      validatorTasks,
      deposits: depositsData,
      withdrawals: withdrawalsData,
      rewardsClaimed,
    });
  } catch (error) {
    console.error("Error fetching validator details:", error);
    res.status(500).json({
      error: "Error fetching validator details",
      details: error.message,
    });
  }
});

router.get("/delegators", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filter = TaskManagerContract.filters.DelegatorStaked();
    const events = await TaskManagerContract.queryFilter(filter, 0, "latest");

    const delegatorAddresses = Array.from(
      new Set(events.map((event) => event.args.delegator))
    );
    const paginatedDelegatorAddresses = paginate(
      delegatorAddresses,
      page,
      limit
    );

    const delegatorsData = await Promise.all(
      paginatedDelegatorAddresses.map(async (delegatorAddress) => {
        const totalDelegationAmount = await TaskManagerContract.getTotalStakes(
          delegatorAddress
        );
        return {
          address: delegatorAddress,
          totalStakes: totalDelegationAmount.toString(),
        };
      })
    );

    res.json(delegatorsData);
  } catch (error) {
    console.error("Error fetching delegators:", error);
    res
      .status(500)
      .json({ error: "Error fetching delegators", details: error.message });
  }
});

router.get("/delegators/:id", async (req, res) => {
  const delegatorId = req.params.id;
  try {
    const totalDelegationAmount = await TaskManagerContract.getTotalStakes(
      delegatorId
    );
    const rewardAmount = await TaskManagerContract.userRewards(delegatorId);

    const delegatorTasks = [];
    let index = 0;

    while (true) {
      try {
        const task = await TaskManagerContract.delegatorTasks(
          delegatorId,
          index
        );

        const delegationStake = await TaskManagerContract.delegatorStakes(
          task.taskId,
          delegatorId
        );
        const latestReward =
          await TaskManagerContract.latestRewardForDelegators(
            task.taskId,
            delegatorId
          );

        delegatorTasks.push({
          validator: task.validator,
          taskId: task.taskId.toString(),
          delegationStake: delegationStake.toString(),
          latestReward: latestReward.toString(),
        });

        index += 1;
      } catch (error) {
        break;
      }
    }

    const rewardsClaimedFilter =
      TaskManagerContract.filters.RewardsClaimed(delegatorId);
    const rewardsClaimedEvents = await TaskManagerContract.queryFilter(
      rewardsClaimedFilter,
      0,
      "latest"
    );

    const rewardsClaimed = rewardsClaimedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      nodeAddress: event.args[0],
      amount: event.args[1].toString(),
    }));

    res.json({
      address: delegatorId,
      totalStakes: totalDelegationAmount.toString(),
      rewardAmount: rewardAmount.toString(),
      delegatorTasks,
      rewardsClaimed,
    });
  } catch (error) {
    console.error("Error fetching delegator details:", error);
    res.status(500).json({
      error: "Error fetching delegator details",
      details: error.message,
    });
  }
});

router.get("/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const taskDetails = await TaskManagerContract.tasks(taskId);

    const taskInfo = {
      id: taskDetails.id.toString(),
      isCompleted: taskDetails.isCompleted,
      creator: taskDetails.creator,
      startTime: new Date(Number(taskDetails.startTime) * 1000).toISOString(),
      expectedDuration: taskDetails.expectedDuration.toString(),
      stakeAmount: taskDetails.stakeAmount.toString(),
      taskName: taskDetails.taskName,
    };

    res.json(taskInfo);
  } catch (error) {
    console.error("Error fetching task details:", error);
    res.status(500).json({
      error: "Error fetching task details",
      details: error.message,
    });
  }
});

router.get("/rewards-claimed", async (req, res) => {
  try {
    const filter = TaskManagerContract.filters.RewardsClaimed();
    const events = await TaskManagerContract.queryFilter(filter, 0, "latest");

    const rewardsClaimed = events.map((event) => ({
      blockNumber: event.blockNumber,
      nodeAddress: event.args[0],
      amount: event.args[1].toString(),
    }));

    res.json({ rewardsClaimed }); // <- Ensure this structure
  } catch (error) {
    console.error("Error fetching reward claim details:", error);
    res.status(500).json({
      error: "Error fetching reward claim details",
      details: error.message,
    });
  }
});

router.get("/tasks-event", async (req, res) => {
  try {
    const taskCreatedFilter = TaskManagerContract.filters.TaskCreated();
    const taskCreatedEvents = await TaskManagerContract.queryFilter(
      taskCreatedFilter,
      0,
      "latest"
    );

    const taskCreatedData = taskCreatedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      taskId: event.args[0].toString(),
      creator: event.args[1],
      expectedDuration: event.args[2].toString(),
      stakeAmount: event.args[3].toString(),
    }));

    const taskFinishedFilter = TaskManagerContract.filters.TaskFinished();
    const taskFinishedEvents = await TaskManagerContract.queryFilter(
      taskFinishedFilter,
      0,
      "latest"
    );

    const taskFinishedData = taskFinishedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      taskId: event.args[0].toString(),
    }));

    const tasksEventData = {
      taskCreated: taskCreatedData,
      taskFinished: taskFinishedData,
    };

    res.json(tasksEventData);
  } catch (error) {
    console.error("Error fetching task events:", error);
    res.status(500).json({
      error: "Error fetching task events",
      details: error.message,
    });
  }
});

router.get("/rewards-distribution", async (req, res) => {
  try {
    const rewardedFilter = TaskManagerContract.filters.ParticipantRewarded();
    const rewardedEvents = await TaskManagerContract.queryFilter(
      rewardedFilter,
      0,
      "latest"
    );

    const rewardedData = rewardedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "ParticipantRewarded",
      amount: event.args[1].toString(), // Assuming `args[1]` contains the reward amount
    }));

    const claimedFilter = TaskManagerContract.filters.RewardsClaimed();
    const claimedEvents = await TaskManagerContract.queryFilter(
      claimedFilter,
      0,
      "latest"
    );

    const claimedData = claimedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "RewardsClaimed",
      amount: event.args[1].toString(), // Assuming `args[1]` contains the claimed amount
    }));

    const combinedEvents = [...rewardedData, ...claimedData];
    combinedEvents.sort((a, b) => a.blockNumber - b.blockNumber);

    res.json(combinedEvents);
  } catch (error) {
    console.error("Error fetching rewards distribution details:", error);
    res.status(500).json({
      error: "Error fetching rewards distribution details",
      details: error.message,
    });
  }
});

router.get("/stake-tracking", async (req, res) => {
  try {
    const nodeDepositFilter = TaskManagerContract.filters.NodeStakeDeposited();
    const nodeDepositEvents = await TaskManagerContract.queryFilter(
      nodeDepositFilter,
      0,
      "latest"
    );
    const nodeDeposits = nodeDepositEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "NodeStakeDeposited",
      amount: event.args[2].toString(), // Assuming args[2] contains the deposit amount
    }));

    const nodeWithdrawFilter = TaskManagerContract.filters.NodeStakeWithdrawn();
    const nodeWithdrawEvents = await TaskManagerContract.queryFilter(
      nodeWithdrawFilter,
      0,
      "latest"
    );
    const nodeWithdrawals = nodeWithdrawEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "NodeStakeWithdrawn",
      amount: event.args[2].toString(), // Assuming args[2] contains the withdrawal amount
    }));

    const validatorDepositFilter =
      TaskManagerContract.filters.ValidatorStakeDeposited();
    const validatorDepositEvents = await TaskManagerContract.queryFilter(
      validatorDepositFilter,
      0,
      "latest"
    );
    const validatorDeposits = validatorDepositEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "ValidatorStakeDeposited",
      amount: event.args[2].toString(), // Assuming args[2] contains the deposit amount
    }));

    const validatorWithdrawFilter =
      TaskManagerContract.filters.ValidatorStakeWithdrawn();
    const validatorWithdrawEvents = await TaskManagerContract.queryFilter(
      validatorWithdrawFilter,
      0,
      "latest"
    );
    const validatorWithdrawals = validatorWithdrawEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "ValidatorStakeWithdrawn",
      amount: event.args[2].toString(), // Assuming args[2] contains the withdrawal amount
    }));

    const allStakeEvents = [
      ...nodeDeposits,
      ...nodeWithdrawals,
      ...validatorDeposits,
      ...validatorWithdrawals,
    ];

    allStakeEvents.sort((a, b) => a.blockNumber - b.blockNumber);

    res.json(allStakeEvents);
  } catch (error) {
    console.error("Error fetching stake tracking events:", error);
    res.status(500).json({
      error: "Error fetching stake tracking events",
      details: error.message,
    });
  }
});

router.get("/delegator-participation", async (req, res) => {
  try {
    const stakedFilter = TaskManagerContract.filters.DelegatorStaked();
    const stakedEvents = await TaskManagerContract.queryFilter(
      stakedFilter,
      0,
      "latest"
    );

    const stakedData = stakedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "DelegatorStaked",
      amount: event.args[3].toString(),
    }));

    const unstakedFilter = TaskManagerContract.filters.DelegatorUnstaked();
    const unstakedEvents = await TaskManagerContract.queryFilter(
      unstakedFilter,
      0,
      "latest"
    );

    const unstakedData = unstakedEvents.map((event) => ({
      blockNumber: event.blockNumber,
      type: "DelegatorUnstaked",
      amount: event.args[3].toString(),
    }));

    const combinedEvents = [...stakedData, ...unstakedData];
    combinedEvents.sort((a, b) => a.blockNumber - b.blockNumber);

    res.json(combinedEvents);
  } catch (error) {
    console.error("Error fetching delegator participation details:", error);
    res.status(500).json({
      error: "Error fetching delegator participation details",
      details: error.message,
    });
  }
});

module.exports = router;
