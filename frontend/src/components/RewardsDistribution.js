import React, { useEffect, useState } from "react";
import { getRewardsClaimed } from "../api";
import BigChart from "./BigChart";
import { useNavigate } from "react-router-dom";

function RewardsDistribution({ tasksCreated, tasksFinished }) {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewardsDistribution = async () => {
      try {
        const data = await getRewardsClaimed(); // This should return the response

        // Log data to ensure you are receiving it properly
        console.log("Fetched rewards claimed data:", data);

        // Check if data exists and has rewardsClaimed
        if (!data || !data.rewardsClaimed) {
          throw new Error("No rewardsClaimed data found");
        }

        let cumulativeClaimed = 0;
        const dataPoints = [];

        // Accumulate reward claimed amounts
        data.rewardsClaimed.forEach((event) => {
          cumulativeClaimed += parseInt(event.amount);
          dataPoints.push({
            blockNumber: event.blockNumber,
            amount: cumulativeClaimed,
            type: "Claimed",
          });
        });

        // Sort dataPoints by block number to ensure chronological order
        dataPoints.sort((a, b) => a.blockNumber - b.blockNumber);

        setGraphData(dataPoints);
      } catch (error) {
        console.error("Error fetching rewards distribution data:", error);
        setError("Unable to fetch data, please try again later.");
      }
    };

    fetchRewardsDistribution();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!graphData.length) return <div className="loading">Loading...</div>;

  return (
    <div className="rewards-distribution-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Rewards Claimed</h2>
      <BigChart
        graphData={graphData}
        tasksCreated={tasksCreated} // No task events for rewards distribution
        tasksFinished={tasksFinished}
      />
    </div>
  );
}

export default RewardsDistribution;
