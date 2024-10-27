import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NodeDetails from "./components/NodeDetails";
import ValidatorDetails from "./components/ValidatorDetails";
import DelegatorDetails from "./components/DelegatorDetails";
import { getTasksEvents } from "./api";
import "./App.scss";
import TaskDetails from "./components/TaskDetails";
import Visualizer from "./components/Visualizer";
import Nodes from "./components/Nodes";
import Validators from "./components/Validators";
import Delegators from "./components/Delegators";
import StakeTracking from "./components/StakeTracking";
import DelegatorParticipation from "./components/DelegatorParticipation";
import RewardsDistribution from "./components/RewardsDistribution";

function App() {
  const [tasksCreated, setTasksCreated] = useState([]);
  const [tasksFinished, setTasksFinished] = useState([]);
  const [tasksError, setTasksError] = useState(null);

  useEffect(() => {
    const fetchTasksEvents = async () => {
      try {
        const tasks = await getTasksEvents();

        const tasksCreatedData = tasks.taskCreated.map((task) => ({
          blockNumber: task.blockNumber,
          taskId: task.taskId,
          type: "TaskCreated",
        }));
        const tasksFinishedData = tasks.taskFinished.map((task) => ({
          blockNumber: task.blockNumber,
          taskId: task.taskId,
          type: "TaskFinished",
        }));

        setTasksCreated(tasksCreatedData);
        setTasksFinished(tasksFinishedData);
      } catch (error) {
        console.error("Error fetching tasks events:", error);
        setTasksError("Unable to fetch task events, please try again later.");
      }
    };

    fetchTasksEvents();
  }, []);

  if (tasksError) {
    return <div className="error-message">{tasksError}</div>;
  }

  return (
    <Router>
      <div className="App">
        <header className="header">
          <Link to="/" className="logo-link">
            <img
              src="https://train.flock.io/static/images/darkLogo.svg"
              alt="Dashboard Logo"
              className="logo"
            />
          </Link>
          <nav className="menu">
            <Link to="/">Visualizer</Link>
            <Link to="/nodes">Nodes</Link>
            <Link to="/validators">Validators</Link>
            <Link to="/delegators">Delegators</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Visualizer />} />
            <Route path="/nodes" element={<Nodes />} />
            <Route path="/validators" element={<Validators />} />
            <Route path="/delegators" element={<Delegators />} />
            <Route path="/nodes/:id" element={<NodeDetails />} />
            <Route path="/validators/:id" element={<ValidatorDetails />} />
            <Route path="/delegators/:id" element={<DelegatorDetails />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route
              path="/stake-tracking"
              element={
                <StakeTracking
                  tasksCreated={tasksCreated}
                  tasksFinished={tasksFinished}
                />
              }
            />
            <Route
              path="/delegator-participation"
              element={
                <DelegatorParticipation
                  tasksCreated={tasksCreated}
                  tasksFinished={tasksFinished}
                />
              }
            />
            <Route
              path="/rewards-claimed"
              element={
                <RewardsDistribution
                  tasksCreated={tasksCreated}
                  tasksFinished={tasksFinished}
                />
              }
            />
          </Routes>
        </main>
        <footer className="footer">
          <Link to="/" className="logo-link">
            <img
              src="https://images.squarespace-cdn.com/content/v1/5f9bcc27c14fc6134658484b/461cb28e-9812-4327-8544-5a8a901a6bfc/logo_02+%281%29.png?format=1500w"
              alt="Encode London"
              className="encode-logo"
            />
          </Link>
          <div>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.encode.club/encodelondon-24/"
            >
              Encode London - 25th-27th October, 2024{" "}
            </a>
            <p>
              © 2024 David Cuellar. All rights reserved,{" "}
              <a
                target="_blank"
                rel="noreferrer"
                 href="https://github.com/davidcuellard"
              >
                GitHub
              </a>
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
