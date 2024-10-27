import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NiceChart from "./NiceChart";
import { formatNumber } from "../utils/formatNumber";
import { getNodeDetails } from "../api";

function NodeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [node, setNode] = useState(null);
  const [stakeGraphData, setStakeGraphData] = useState([]);
  const [rewardGraphData, setRewardGraphData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNode = async () => {
      try {
        if (id) {
          const data = await getNodeDetails(id);
          setNode(data);

          let cumulativeStake = 0;
          const stakeDataPoints = [];

          stakeDataPoints.push({
            blockNumber: 0,
            amount: cumulativeStake,
            type: "Initial",
            taskId: "N/A",
          });

          const stakeEvents = [
            ...data.deposits.map((deposit) => ({
              blockNumber: deposit.blockNumber,
              change: parseInt(deposit.amount),
              type: "Deposit",
              taskId: deposit.taskId,
            })),
            ...data.withdrawals.map((withdrawal) => ({
              blockNumber: withdrawal.blockNumber,
              change: -parseInt(withdrawal.amount),
              type: "Withdrawal",
              taskId: withdrawal.taskId,
            })),
          ];

          stakeEvents.sort((a, b) => a.blockNumber - b.blockNumber);

          stakeEvents.forEach((event) => {
            cumulativeStake += event.change;
            stakeDataPoints.push({
              blockNumber: event.blockNumber,
              amount: cumulativeStake,
              type: event.type,
              taskId: event.taskId,
            });
          });

          stakeDataPoints.push({
            blockNumber: 17106529,
            amount: cumulativeStake,
            type: "Final",
            taskId: "N/A",
          });

          setStakeGraphData(stakeDataPoints);

          let cumulativeReward = 0;
          const rewardDataPoints = [];

          rewardDataPoints.push({
            blockNumber: 0,
            amount: cumulativeReward,
            type: "Initial",
          });

          data.rewardsClaimed.forEach((reward) => {
            cumulativeReward += parseInt(reward.amount);
            rewardDataPoints.push({
              blockNumber: reward.blockNumber,
              amount: cumulativeReward,
              type: "Reward",
            });
          });

          rewardDataPoints.push({
            blockNumber: 17106529,
            amount: cumulativeReward,
            type: "Final",
          });

          setRewardGraphData(rewardDataPoints);
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
          <span className="label">Total Stakes:</span>{" "}
          {formatNumber(node.totalStakes)}
        </p>
        <p>
          <span className="label">User Reward Amount:</span>{" "}
          {formatNumber(node.rewardAmount)}
        </p>
        <p>
          <span className="label">Rewards Claimed:</span>{" "}
          {formatNumber(rewardGraphData[rewardGraphData.length - 1].amount)}
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

      <h3>Node Stake History</h3>
      <NiceChart graphData={stakeGraphData} />

      <h3>Total Rewards Claimed History</h3>
      <NiceChart graphData={rewardGraphData} />
    </div>
  );
}

export default NodeDetails;
