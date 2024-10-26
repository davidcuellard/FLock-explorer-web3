const { FMLContract } = require("./contracts");

async function testFML() {
  try {
    const name = await FMLContract.name();
    const symbol = await FMLContract.symbol();
    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);
  } catch (error) {
    console.error("Error interacting with FMLContract:", error);
  }
}

testFML();
