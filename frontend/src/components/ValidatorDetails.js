import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getValidatorDetails } from "../api";

function ValidatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validator, setValidator] = useState(null);

  useEffect(() => {
    const fetchValidator = async () => {
      if (id) {
        const data = await getValidatorDetails(id);
        setValidator(data);
      }
    };
    fetchValidator();
  }, [id]);

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
    </div>
  );
}

export default ValidatorDetails;
