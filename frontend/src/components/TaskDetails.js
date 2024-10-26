import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTaskDetails } from "../api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (id) {
        const data = await getTaskDetails(id);
        setTask(data);
      }
    };
    fetchTask();
  }, [id]);

  if (!task) return <div className="loading">Loading...</div>;

  return (
    <div className="details-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Task Details</h2>
      <div className="info-section">
        <p>
          <span className="label-task">Task ID:</span> {task.id}
        </p>
        <p>
          <span className="label-task">Name:</span> {task.taskName}
        </p>
        <p>
          <span className="label-task">Creator:</span> {task.creator}
        </p>
        <p>
          <span className="label-task">Is Completed:</span>{" "}
          {task.isCompleted ? "Yes" : "No"}
        </p>
        <p>
          <span className="label-task">Start Time:</span> {task.startTime}
        </p>
        <p>
          <span className="label-task">Expected Duration:</span>{" "}
          {task.expectedDuration}
        </p>
        <p>
          <span className="label-task">Stake Amount:</span> {task.stakeAmount}
        </p>
      </div>
    </div>
  );
}

export default TaskDetails;
