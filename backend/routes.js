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

    const filter = TaskManagerContract.filters.NodeStakeDeposited();
    const events = await TaskManagerContract.queryFilter(filter, 0, "latest");

    const nodeAddresses = Array.from(
      new Set(events.map((event) => event.args.node))
    );
    const paginatedNodeAddresses = paginate(nodeAddresses, page, limit);

    const nodesData = await Promise.all(
      paginatedNodeAddresses.map(async (nodeAddress) => {
        const totalStakes = await TaskManagerContract.getTotalStakes(
          nodeAddress
        );
        return { address: nodeAddress, totalStakes: totalStakes.toString() };
      })
    );

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

    res.json({
      address: nodeId,
      totalStakes: totalStakes.toString(),
      taskIds: taskIds.map((id) => id.toString()),
      rewardAmount: rewardAmount.toString(),
      availableRewardTasksForUser: availableRewardTasksForUser.map((id) =>
        id.toString()
      ),
      taskStakeDetails,
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

    const filter = TaskManagerContract.filters.ValidatorStakeDeposited();
    const events = await TaskManagerContract.queryFilter(filter, 0, "latest");

    const validatorAddresses = Array.from(
      new Set(events.map((event) => event.args.validator))
    );
    const paginatedValidatorAddresses = paginate(
      validatorAddresses,
      page,
      limit
    );

    const validatorsData = await Promise.all(
      paginatedValidatorAddresses.map(async (validatorAddress) => {
        const validatorStake = await TaskManagerContract.getTotalStakes(
          validatorAddress
        );
        return {
          address: validatorAddress,
          totalStakes: validatorStake.toString(),
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

        const delegatorStake =
          await TaskManagerContract.validatorTotalDelegatorStakes(
            taskId,
            validatorId
          );

        validatorTasks.push({
          taskId: taskId.toString(),
          delegatorStake: delegatorStake.toString(),
        });

        index += 1;
      } catch (error) {
        break;
      }
    }

    res.json({
      address: validatorId,
      totalStakes: validatorStake.toString(),
      rewardAmount: rewardAmount.toString(),
      availableRewardTasksForUser: availableRewardTasksForUser.map((id) =>
        id.toString()
      ),
      validatorTasks,
    });
  } catch (error) {
    console.error("Error fetching validator details:", error);
    res.status(500).json({
      error: "Error fetching validator details",
      details: error.message,
    });
  }
});

/**
 * Route to get basic delegator information
 */
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

/**
 * Route to get full delegator details by ID
 */
router.get("/delegators/:id", async (req, res) => {
  const delegatorId = req.params.id;
  try {
    const totalDelegationAmount = await TaskManagerContract.getTotalStakes(
      delegatorId
    );

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

    res.json({
      address: delegatorId,
      totalStakes: totalDelegationAmount.toString(),
      delegatorTasks,
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
      startTime: new Date(Number(taskDetails.startTime) * 1000).toISOString(), // Ensure conversion from BigInt
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

module.exports = router;
