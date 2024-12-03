import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDelegatorDetails } from "../api";
import { formatNumber } from "../utils/formatNumber";
import NiceChart from "./NiceChart";

function DelegatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delegator, setDelegator] = useState(null);
  const [rewardGraphData, setRewardGraphData] = useState([]);

  useEffect(() => {
    const fetchDelegator = async () => {
      try {
        if (id) {
          const data = await getDelegatorDetails(id);
          setDelegator(data);

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
        console.error("Error fetching delegator details:", error);
      }
    };
    fetchDelegator();
  }, [id]);

  if (!delegator) return <div className="loading">Loading...</div>;

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Delegator Details</h2>
      <div className="info-section">
        <p>
          <span className="label">Address:</span> {delegator.address}
        </p>
        <p>
          <span className="label">Total Stakes:</span>{" "}
          {formatNumber(delegator.totalStakes)}
        </p>
        <p>
          <span className="label">User Reward Amount:</span>{" "}
          {formatNumber(delegator.rewardAmount)}
        </p>
        <p>
          <span className="label">Rewards Claimed:</span>{" "}
          {formatNumber(rewardGraphData[rewardGraphData.length - 1].amount)}
        </p>
      </div>
      <div className="task-list">
        <h3>Tasks</h3>
        {delegator.delegatorTasks.map((task) => (
          <div key={task.taskId} className="task-item">
            <div className="task-info">
              <p>
                <span className="label">Task ID:</span> {task.taskId}
              </p>
              <p>
                <span className="label">Delegation Stake:</span>{" "}
                {task.delegationStake}
              </p>
              <p>
                <span className="label">Latest Reward:</span>{" "}
                {task.latestReward}
              </p>
            </div>
            <Link to={`/tasks/${task.taskId}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>

      <h3>Total Rewards Claimed History</h3>
      <NiceChart graphData={rewardGraphData} />
    </div>
  );
}

export default DelegatorDetails;
