import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDelegatorDetails } from "../api";

function DelegatorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delegator, setDelegator] = useState(null);

  useEffect(() => {
    const fetchDelegator = async () => {
      if (id) {
        const data = await getDelegatorDetails(id);
        setDelegator(data);
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
          <span className="label">Total Stakes:</span> {delegator.totalStakes}
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
    </div>
  );
}

export default DelegatorDetails;
