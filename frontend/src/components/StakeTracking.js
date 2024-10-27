import React, { useEffect, useState } from "react";
import { getStakeTracking } from "../api";
import BigChart from "./BigChart";
import { useNavigate } from "react-router-dom";

function StakeTracking({ tasksCreated, tasksFinished }) {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStakeTracking = async () => {
      try {
        const data = await getStakeTracking();

        let cumulativeNodeStake = 0;
        let cumulativeValidatorStake = 0;
        const dataPointsMap = new Map();

        data.forEach((event) => {
          const blockNumber = event.blockNumber;
          const changeAmount = event.type.includes("Withdrawn")
            ? -parseInt(event.amount)
            : parseInt(event.amount);

          if (event.type.includes("NodeStake")) {
            cumulativeNodeStake += changeAmount;
          } else if (event.type.includes("ValidatorStake")) {
            cumulativeValidatorStake += changeAmount;
          }

          if (!dataPointsMap.has(blockNumber)) {
            dataPointsMap.set(blockNumber, {
              blockNumber,
              nodeStake: cumulativeNodeStake,
              validatorStake: cumulativeValidatorStake,
            });
          } else {
            const existingPoint = dataPointsMap.get(blockNumber);
            dataPointsMap.set(blockNumber, {
              ...existingPoint,
              nodeStake: cumulativeNodeStake,
              validatorStake: cumulativeValidatorStake,
            });
          }
        });

        const dataPoints = Array.from(dataPointsMap.values()).sort(
          (a, b) => a.blockNumber - b.blockNumber,
        );

        setGraphData(dataPoints);
      } catch (error) {
        console.error("Error fetching stake tracking data:", error);
        setError("Unable to fetch data, please try again later.");
      }
    };

    fetchStakeTracking();
  }, []);

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="stake-tracking-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Stake Tracking</h2>
      <BigChart
        graphData={graphData}
        tasksCreated={tasksCreated}
        tasksFinished={tasksFinished}
        additionalLines={[
          {
            dataKey: "validatorStake",
            color: "#ffce21",
          },
          {
            dataKey: "nodeStake",
            color: "#598bff",
          },
        ]}
      />
    </div>
  );
}

export default StakeTracking;
