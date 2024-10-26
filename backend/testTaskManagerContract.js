const { TaskManagerContract } = require("./contracts");

async function testTaskManager() {
  try {
    const filter = TaskManagerContract.filters.RewardsClaimed(
      "0x177f0758030e963229dFD221ec09fD23E2938c0C"
    );
    const events = await TaskManagerContract.queryFilter(
      filter,
      0,
      "latest"
    );

    const nodeAddresses = new Set();
    for (const event of events) {
      nodeAddresses.add(event);
    }

    console.log("Training Nodes:", Array.from(nodeAddresses));
  } catch (error) {
    console.error("Error interacting with TaskManagerContract:", error);
  }
}

testTaskManager();
