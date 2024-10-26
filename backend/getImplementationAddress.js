require("dotenv").config({ path: "../.env" });
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);

const FML_PROXY_ADDRESS = "0xc8d94c5cB4462966473b3b1505B8129f12152977";
const TASK_MANAGER_PROXY_ADDRESS = "0x7b6bde1d173eb288f390ff36e21801f42c4d8d91";
const STAKING_PROXY_ADDRESS = "0x03868b04505E9e20fe71AB7246B63a6e8461892C";

async function getImplementationAddress(proxyAddress) {
  // EIP-1967 implementation slot: keccak256('eip1967.proxy.implementation') - 1
  const IMPLEMENTATION_SLOT =
    "0x360894A13BA1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";

  // Get storage at the implementation slot
  const storage = await provider.getStorage(proxyAddress, IMPLEMENTATION_SLOT);

  // The implementation address is the last 20 bytes of the storage data
  const implAddress = "0x" + storage.slice(-40);

  return ethers.getAddress(implAddress);
}

getImplementationAddress(FML_PROXY_ADDRESS)
  .then((implAddress) => {
    console.log("FML Implementation Address:", implAddress);
  })
  .catch((error) => {
    console.error("Error fetching FML implementation address:", error);
  });

getImplementationAddress(TASK_MANAGER_PROXY_ADDRESS)
  .then((implAddress) => {
    console.log("Task Manager Implementation Address:", implAddress);
  })
  .catch((error) => {
    console.error("Error fetching Task Manager implementation address:", error);
  });

getImplementationAddress(STAKING_PROXY_ADDRESS)
  .then((implAddress) => {
    console.log("Staking Implementation Address:", implAddress);
  })
  .catch((error) => {
    console.error("Error fetching Staking implementation address:", error);
  });
