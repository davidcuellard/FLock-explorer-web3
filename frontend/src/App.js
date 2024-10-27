import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import List from "./components/List";
import NodeDetails from "./components/NodeDetails";
import ValidatorDetails from "./components/ValidatorDetails";
import DelegatorDetails from "./components/DelegatorDetails";
import { getNodes, getValidators, getDelegators } from "./api";
import "./App.scss";
import TaskDetails from "./components/TaskDetails";
import Visualizer from "./components/Visualizer";
import Nodes from "./components/Nodes";
import Validators from "./components/Validators";
import Delegators from "./components/Delegators";

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
          </Routes>
        </main>
        <footer className="footer">
          <p>
            © 2023 David Cuellar. All rights reserved,{" "}
            <a target="_blank" href="https://github.com/davidcuellard">
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
