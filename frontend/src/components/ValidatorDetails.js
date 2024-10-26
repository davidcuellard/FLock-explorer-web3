import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import StakeHistoryChart from "./StakeHistoryChart";

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

const getValidatorDetails = (validatorId) =>
  fetchDataWithRetry(`/api/validators/${validatorId}`);

function ValidatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validator, setValidator] = useState(null);
  const [graphData, setGraphData] = useState([]);
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
          <span className="label">Total Stakes:</span> {validator.totalStakes}
        </p>
        <p>
          <span className="label">Reward Amount:</span> {validator.rewardAmount}
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
                <span className="label">Delegator Stake:</span>{" "}
                {task.delegatorStake}
              </p>
            </div>
            <Link to={`/tasks/${task.taskId}`} className="view-details-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>

      <h3>Validator Stake History</h3>
      <StakeHistoryChart graphData={graphData} />
    </div>
  );
}

export default ValidatorDetails;
