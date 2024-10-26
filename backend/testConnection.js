const provider = require("./blockchain");

async function testConnection() {
  try {
    const blockNumber = await provider.getBlockNumber();
    console.log(
      "Connected to Base Sepolia network. Current block number:",
      blockNumber
    );
  } catch (error) {
    console.error("Error connecting to the network:", error);
  }
}

testConnection();
