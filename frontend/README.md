# Overview

The frontend for the FLock Training Nodes and Validators Explorer is built in React, providing an intuitive interface for exploring nodes, validators, and their performance metrics. It includes visualizations for easy understanding of data points and trends.

## Technologies Used

- React: Main JavaScript library used for building user interfaces.

- Axios: For making API requests to the backend server.

- Recharts: For visualizing staking data, delegator participation, and rewards distributions.

- SCSS: For styling components, with a watch-css command to compile changes automatically.

## Setup Instructions

1. Dependencies: Install dependencies using:

`npm install`

2. Running the Application: Start the frontend with:

`npm start`

3. SCSS Compilation: If you make any changes to the SCSS, use:

`npm run watch-css`

## Features

- Training Node Explorer: View nodes and validators, with metrics like success rate, earnings, and model contributions.

- Interactive Charts: Uses Recharts for visualizing the data fetched from the backend.

- Paginator and Filtering: Allows users to navigate through nodes and validators efficiently.

[!NOTE]
!todo(): Add more interactive features, such as a search bar and filter options for improved navigation.

## Notes

- Ensure the backend is running properly before launching the frontend to avoid errors when making API requests.

- The application is currently using a CSV for simplified testing, but a live database connection is recommended for production.

