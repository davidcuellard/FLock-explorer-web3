import React, { useEffect, useState } from "react";
import { getDelegatorParticipation } from "../api";
import BigChart from "./BigChart";
import { useNavigate } from "react-router-dom";

function DelegatorParticipation({ tasksCreated, tasksFinished }) {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
      
    const fetchDelegatorParticipation = async () => {
      try {
        const data = await getDelegatorParticipation();

        let cumulativeStaked = 0;
        const dataPoints = [];

        data.forEach((event) => {
          const amount = parseInt(event.amount);

          if (event.type === "DelegatorStaked") {
            cumulativeStaked += amount;
          } else if (event.type === "DelegatorUnstaked") {
            cumulativeStaked -= amount;
          }

          dataPoints.push({
            blockNumber: event.blockNumber,
            amount: cumulativeStaked,
          });
        });

        dataPoints.sort((a, b) => a.blockNumber - b.blockNumber);

        if (dataPoints.length === 0) {
          console.warn("No data points were generated for the graph.");
        }

        setGraphData(dataPoints);
      } catch (error) {
        console.error("Error fetching delegator participation data:", error);
        setError("Unable to fetch data, please try again later.");
      }
    };

    fetchDelegatorParticipation();
  }, []);

  if (error) return <div className="error-message">{error}</div>;
  if (!graphData.length) return <div className="loading">Loading...</div>;

  return (
    <div className="delegator-participation-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Delegator Participation</h2>
      <BigChart
        graphData={graphData}
        tasksCreated={tasksCreated}
        tasksFinished={tasksFinished}
      />
    </div>
  );
}

export default DelegatorParticipation;
