const { TaskManagerContract } = require("./contracts");

async function testTaskManager() {
  try {
    // Fetch events as previously discussed
    const filter = TaskManagerContract.filters.NodeStakeDeposited();
    const events = await TaskManagerContract.queryFilter(
      filter,
      0,
      "latest"
    );

    const nodeAddresses = new Set();
    for (const event of events) {
      nodeAddresses.add(event.args.node);
    }

    console.log("Training Nodes:", Array.from(nodeAddresses));
  } catch (error) {
    console.error("Error interacting with TaskManagerContract:", error);
  }
}

testTaskManager();
