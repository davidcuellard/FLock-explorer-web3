import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import NiceChart from "./NiceChart";
import { formatNumber } from "../utils/formatNumber";
import { getValidatorDetails } from "../api";

function ValidatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validator, setValidator] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [rewardGraphData, setRewardGraphData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchValidator = async () => {
      try {
        if (id) {
          const data = await getValidatorDetails(id);
          setValidator(data);

          let cumulativeStake = 0;
          const dataPoints = [];

          dataPoints.push({
            blockNumber: 0,
            amount: cumulativeStake,
            type: "Initial",
            taskId: "N/A",
          });

          const events = [
            ...data.deposits.map((deposit) => ({
              blockNumber: deposit.blockNumber,
              change: parseInt(deposit.amount),
              type: "Deposit",
              taskId: deposit.taskId,
            })),
            ...data.withdrawals.map((withdrawal) => ({
              blockNumber: withdrawal.blockNumber,
              change: -parseInt(withdrawal.amount), // Negative for withdrawal
              type: "Withdrawal",
              taskId: withdrawal.taskId,
            })),
          ];

          events.sort((a, b) => a.blockNumber - b.blockNumber);

          events.forEach((event) => {
            cumulativeStake += event.change;
            dataPoints.push({
              blockNumber: event.blockNumber,
              amount: cumulativeStake,
              type: event.type,
              taskId: event.taskId,
            });
          });

          dataPoints.push({
            blockNumber: 17106529,
            amount: cumulativeStake,
            type: "Final",
            taskId: "N/A",
          });

          setGraphData(dataPoints);

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
        console.error("Error fetching validator details:", error);
        setError("Unable to fetch validator details, please try again later.");
      }
    };
    fetchValidator();
  }, [id]);

  if (error) return <div className="error-message">{error}</div>;
  if (!validator) return <div className="loading">Loading...</div>;

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Validator Details</h2>
      <div className="info-section">
        <p>
          <span className="label">Address:</span> {validator.address}
        </p>
        <p>
          <span className="label">Total Stakes:</span>{" "}
          {formatNumber(validator.totalStakes)}
        </p>
        <p>
          <span className="label">User Reward Amount:</span>{" "}
          {formatNumber(validator.rewardAmount)}
        </p>
        <p>
          <span className="label">Rewards Claimed:</span>{" "}
          {formatNumber(rewardGraphData[rewardGraphData.length - 1].amount)}
        </p>
      </div>
      <div className="task-list">
        <h3>Tasks</h3>
        {validator.validatorTasks.map((task) => (
          <div key={task.taskId} className="task-item">
            <div className="task-info">
              <p>
                <span className="label">Task ID:</span> {task.taskId}
              </p>
              <p>
                <span className="label">Validator Stake:</span>{" "}
                {task.validatorStake}
              </p>
            </div>
            <Link to={`/tasks/${task.taskId}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>

      <h3>Validator Stake History</h3>
      <NiceChart graphData={graphData} />

      <h3>Total Rewards Claimed History</h3>
      <NiceChart graphData={rewardGraphData} />
    </div>
  );
}

export default ValidatorDetails;
