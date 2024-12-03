# Overview

The backend of the FLock Training Nodes and Validators Explorer provides APIs to connect and interact with the FML, Task Manager, and Staking contracts on the Base Sepolia network. The goal is to provide all necessary blockchain data to the frontend in a user-friendly format.

##  Technologies Used

- Node.js & Express: To create an API server that listens to blockchain events.

- ethers.js: For interacting with the blockchain and fetching contract data.

- Alchemy: An RPC service provider used to connect to the Base Sepolia network.

- cors: Middleware for handling cross-origin requests.

## Setup Instructions

1. Dependencies: Install all dependencies using:

`npm install`

2. Environment Variables: Set up your environment variables in `.env` file:

```
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/<Your_Alchemy_Key>
```

3. Change proxy to localhost:3001

```
"proxy": "http://localhost:3001",
```

4. Run the Server: Start the server using:

`node index.js`

5. Endpoints:

- /nodes: Fetches all nodes with staking data, sorted by rewards claimed, including information such as address, reward amount, and total stakes.

- /nodes/:id : Provides detailed information about a specific node, including total stakes, reward amount, available reward tasks, node stake details, deposits, withdrawals, and rewards claimed.

- /validators: Fetches all validators with staking data, sorted by rewards claimed, including address, reward amount, and total stakes.

- /validators/:id : Retrieves detailed information for a specific validator, including stake information, reward tasks, deposits, withdrawals, and rewards claimed.

- /delegators: Lists all delegators with their staking amounts, including address and total stakes.

- /delegators/:id : Retrieves detailed information for a specific delegator, including staking, reward amount, delegator tasks, and rewards claimed.

- /tasks/:id : Fetches details about a specific task, such as task ID, creator, completion status, start time, expected duration, stake amount, and task name.

- /tasks-event: Retrieves task events, including both created and finished tasks, with relevant details such as block number, task ID, creator, expected duration, and stake amount.

- /rewards-claimed: Tracks rewards claimed by nodes, validators, and delegators, including block number, node address, and claimed amount.

- /rewards-distribution: Combines data of both rewarded participants and rewards claimed, giving a comprehensive overview of reward distribution events.

- /stake-tracking: Fetches events related to node and validator staking, such as deposits and withdrawals, providing an overview of staking activity.

- /delegator-participation: Provides insights on delegator activities, tracking when delegators staked or unstaked their tokens, along with the block number and amount.

[!NOTE]  
!todo(): Create a database for better data management and caching to improve API performance.

## Notes

- Proxy Contracts: Ensure you’re pointing to the correct implementation addresses as the contracts are proxies.

- Compute Limitations: Due to the high frequency of blockchain queries, the current solution is better suited for small-scale testing. Consider optimizing with a database for production.