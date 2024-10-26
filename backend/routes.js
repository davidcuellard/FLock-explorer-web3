const express = require("express");
const router = express.Router();
const { TaskManagerContract } = require("./contracts");

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 300 });

/**
 * Helper function to paginate results
 */
function paginate(array, page, limit) {
  const startIndex = (page - 1) * limit;
  return array.slice(startIndex, startIndex + limit);
}

/**
 * Route to get basic node information
 */
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
        return { address: nodeAddress, stake: totalStakes.toString() };
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

/**
 * Route to get full node details by ID
 */
router.get("/nodes/:id", async (req, res) => {
  const nodeId = req.params.id;
  try {
    const totalStakes = await TaskManagerContract.getTotalStakes(nodeId);
    const taskIds = await TaskManagerContract.getNodeTasks(nodeId);
    const rewardAmount = await TaskManagerContract.userRewards(nodeId);
    const nodeStakeDetails = await TaskManagerContract.nodeStakes(nodeId);

    res.json({
      address: nodeId,
      totalStakes: totalStakes.toString(),
      taskIds: taskIds.map((id) => id.toString()),
      rewardAmount: rewardAmount.toString(),
      stakeDetails: nodeStakeDetails,
    });
  } catch (error) {
    console.error("Error fetching node details:", error);
    res
      .status(500)
      .json({ error: "Error fetching node details", details: error.message });
  }
});

/**
 * Route to get basic validator information
 */
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
        return { address: validatorAddress, stake: validatorStake.toString() };
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

/**
 * Route to get full validator details by ID
 */
router.get("/validators/:id", async (req, res) => {
  const validatorId = req.params.id;
  try {
    const validatorStake = await TaskManagerContract.getValidatorStakes(
      validatorId
    );
    const taskIds = await TaskManagerContract.getValidatorTasks(validatorId);
    const totalDelegatorStake =
      await TaskManagerContract.validatorTotalDelegatorStakes(validatorId);
    const delegatorDetails = await TaskManagerContract.delegatorValidatorStakes(
      validatorId
    );

    res.json({
      address: validatorId,
      validatorStake: validatorStake.toString(),
      taskIds: taskIds.map((id) => id.toString()),
      totalDelegatorStake: totalDelegatorStake.toString(),
      delegatorDetails: delegatorDetails.map((detail) => ({
        delegator: detail.delegator,
        stake: detail.amount.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching validator details:", error);
    res
      .status(500)
      .json({
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
          stake: totalDelegationAmount.toString(),
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
    const delegatorTasks = await TaskManagerContract.delegatorTasks(
      delegatorId
    );
    const totalDelegationAmount = await TaskManagerContract.getTotalStakes(
      delegatorId
    );

    res.json({
      address: delegatorId,
      totalDelegationAmount: totalDelegationAmount.toString(),
      delegatorTasks: delegatorTasks.map((task) => ({
        validator: task.validator,
        taskId: task.taskId.toString(),
        stake: task.amount.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching delegator details:", error);
    res
      .status(500)
      .json({
        error: "Error fetching delegator details",
        details: error.message,
      });
  }
});

module.exports = router;
