import React, { useEffect, useState } from "react";
import { getRewardsClaimed } from "../api";
import BigChart from "./BigChart";

function Visualizer() {
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewardsClaimed = async () => {
      try {
        const data = await getRewardsClaimed();

        const dataPoints = data.map((reward) => ({
          blockNumber: reward.blockNumber,
          amount: parseInt(reward.amount),
          nodeAddress: reward.nodeAddress,
        }));

        setGraphData(dataPoints);
      } catch (error) {
        console.error("Error fetching rewards claimed:", error);
        setError(
          "Unable to fetch rewards claimed data, please try again later."
        );
      }
    };
    fetchRewardsClaimed();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!graphData.length) return <div className="loading">Loading...</div>;

  return (
    <div className="visualizer-page">
      <h2>Rewards Claimed by Block</h2>
      <BigChart graphData={graphData} />

    </div>
  );
}

export default Visualizer;
