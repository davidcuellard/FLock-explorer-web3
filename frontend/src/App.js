import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import List from "./components/List";
import NodeDetails from "./components/NodeDetails";
import ValidatorDetails from "./components/ValidatorDetails";
import DelegatorDetails from "./components/DelegatorDetails";
import { getNodes, getValidators, getDelegators } from "./api";
import "./App.scss";
import TaskDetails from "./components/TaskDetails";

function App() {
  const [nodes, setNodes] = useState([]);
  const [validators, setValidators] = useState([]);
  const [delegators, setDelegators] = useState([]);
  const [nodesPage, setNodesPage] = useState(1);
  const [validatorsPage, setValidatorsPage] = useState(1);
  const [delegatorsPage, setDelegatorsPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setNodes(await getNodes(nodesPage, itemsPerPage));
    setValidators(await getValidators(validatorsPage, itemsPerPage));
    setDelegators(await getDelegators(delegatorsPage, itemsPerPage));
  };

  useEffect(() => {
    fetchData();
  }, [nodesPage, validatorsPage, delegatorsPage]);

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
            {/* <Link to="/">Home</Link> */}
            <Link to="/visualizer">Visualizer</Link>
            <Link to="/nodes">Nodes</Link>
            <Link to="/validators">Validators</Link>
            <Link to="/delegators">Delegators</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>Welcome to the FLock Explorer</h1>
                </>
              }
            />

            <Route
              path="/nodes"
              element={
                <List
                  title="Nodes"
                  data={nodes}
                  itemsPerPage={itemsPerPage}
                  currentPage={nodesPage}
                  onPageChange={setNodesPage}
                />
              }
            />
            <Route
              path="/validators"
              element={
                <List
                  title="Validators"
                  data={validators}
                  itemsPerPage={itemsPerPage}
                  currentPage={validatorsPage}
                  onPageChange={setValidatorsPage}
                />
              }
            />
            <Route
              path="/delegators"
              element={
                <List
                  title="Delegators"
                  data={delegators}
                  itemsPerPage={itemsPerPage}
                  currentPage={delegatorsPage}
                  onPageChange={setDelegatorsPage}
                />
              }
            />
            <Route path="/nodes/:id" element={<NodeDetails />} />
            <Route path="/validators/:id" element={<ValidatorDetails />} />
            <Route path="/delegators/:id" element={<DelegatorDetails />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>
            © 2023 David Cuellar. All rights reserved,{" "}
            <a target="_blank" href="https://github.com/davidcuellard">GitHub</a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
