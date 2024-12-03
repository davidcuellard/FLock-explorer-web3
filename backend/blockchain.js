require("dotenv").config({ path: ".env" });
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);

module.exports = provider;
