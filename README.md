# FLock.io Training Nodes and Validators Explorer

Welcome to the FLock Training Nodes and Validators Explorer! This project aims to provide a transparent view of the FLock ecosystem, allowing users to explore training nodes and validators with detailed metrics and performance insights. Think of it as a specialized block explorer tailored to display AI model metrics, rankings, and earnings.

# Gif
![image](https://github.com/davidcuellard/FLock-explorer-web3/blob/main/frontend/public/demo.gif?raw=true)    

## Key Features

- Node and Validator Listings: General information such as address, total stakes, user, reward amount, rewards claimed, node tasks with node stake, and two charts: Stake History and Total Rewards Claimed History. Delegators have similar information, except without the Stake History.

- Comparison and Ranking: Nodes and Validators are sorted by Rewards Claimed in descending order.

- Task Details: Task ID: 1, Name: [Name], Creator: [Creator], Is Completed: Yes/No, Start Time: [Start Time], Expected Duration: [Duration], Stake Amount: [Stake Amount].

- More Charts: Stake, Tracking Delegator Participation, and Rewards Distribution.

## Tech Stack Overview

- Frontend: React, with data visualization libraries like Recharts

- Backend: Node.js, Express, connecting directly to the blockchain using ethers.js

- Blockchain Integration: Direct interaction with contracts on the Base Sepolia chain (FML, Task Manager, Staking).

To get started, you’ll find the backend and frontend folders each with its own `README` file to help guide setup and development.

## How to Run

- Create `.env` with
  ```
  FML_ADDRESS=0xc8d94c5cB4462966473b3b1505B8129f12152977
  TASK_MANAGER_ADDRESS=0x7b6bde1d173eb288f390ff36e21801f42c4d8d91
  STAKING_ADDRESS=0x03868b04505E9e20fe71AB7246B63a6e8461892C
  FML_IMPLEMENTATION_ADDRESS=0x6316cAE4b1E121e202166b6F2Cf2CD858c32357A
  TASK_MANAGER_IMPLEMENTATION_ADDRESS=0x2DAeF4683319a01933e18858962F2804292672a8
  STAKING_IMPLEMENTATION_ADDRESS=0x18616c7A0AfD2a7854E85e93F9a3aB1d6839EEEd
  ```

- Backend: `node index.js`

- Frontend: `npm start`

- SCSS Changes: Run `npm run watch-css` to compile SCSS files.

## Project Structure

- backend: Handles blockchain integration, data fetching, and API setup.

- frontend: Visualizes the fetched data, offering an intuitive interface for users.

Please refer to each folder for more detailed instructions on setting up and running the components.