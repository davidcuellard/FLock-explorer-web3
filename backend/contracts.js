require("dotenv").config({ path: "../.env" });
const { ethers } = require("ethers");
const provider = require("./blockchain");

const FMLImplementation_ABI = require("./abis/FMLImplementation.json");
const TaskManagerImplementation_ABI = require("./abis/TaskManagerImplementation.json");
const Staking_ABI = require("./abis/StakingImplementation.json");

const FML_PROXY_ADDRESS = process.env.FML_ADDRESS;

const TASK_MANAGER_PROXY_ADDRESS = process.env.TASK_MANAGER_ADDRESS;

const STAKING_ADDRESS = process.env.STAKING_ADDRESS;

// Creating contract instances
const FMLContract = new ethers.Contract(
  FML_PROXY_ADDRESS,
  FMLImplementation_ABI,
  provider,
);

const TaskManagerContract = new ethers.Contract(
  TASK_MANAGER_PROXY_ADDRESS,
  TaskManagerImplementation_ABI,
  provider,
);

const StakingContract = new ethers.Contract(
  STAKING_ADDRESS,
  Staking_ABI,
  provider,
);

module.exports = {
  FMLContract,
  TaskManagerContract,
  StakingContract,
};
