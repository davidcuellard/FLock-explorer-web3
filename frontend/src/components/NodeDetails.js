import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Helper function with retry logic for fetching data
const fetchDataWithRetry = async (url, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
};

// Function to fetch node details
const getNodeDetails = (nodeId) => fetchDataWithRetry(`/api/nodes/${nodeId}`);

function NodeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [node, setNode] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNode = async () => {
      try {
        if (id) {
          const data = await getNodeDetails(id);
          setNode(data);
        }
      } catch (error) {
        console.error("Error fetching node details:", error);
        setError("Unable to fetch node details, please try again later.");
      }
    };
    fetchNode();
  }, [id]);

  if (error) return <div className="error-message">{error}</div>;
  if (!node) return <div className="loading">Loading...</div>;

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Node Details</h2>
      <div className="info-section">
        <h3>General Information</h3>
        <p>
          <span className="label">Address:</span> {node.address}
        </p>
        <p>
          <span className="label">Total Stakes:</span> {node.totalStakes}
        </p>
        <p>
          <span className="label">Reward Amount:</span> {node.rewardAmount}
        </p>
      </div>
      <div className="task-list">
        {node.taskStakeDetails.map((task) => (
          <div key={task.taskId} className="task-item">
            <div className="task-info">
              <p>
                <span className="label">Task ID:</span> {task.taskId}
              </p>
              <p>
                <span className="label">Node Stake:</span> {task.nodeStake}
              </p>
            </div>
            <a href={`/tasks/${task.taskId}`} className="view-details-btn">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NodeDetails;
