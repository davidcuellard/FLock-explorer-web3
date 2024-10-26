import React, { useEffect, useState } from "react";
import List from "./components/List";
import { getNodes, getValidators, getDelegators } from "./api";
import "./App.scss";

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
    <div className="App">
      <h1>Dashboard</h1>
      <List
        title="Nodes"
        data={nodes}
        itemsPerPage={itemsPerPage}
        currentPage={nodesPage}
        onPageChange={setNodesPage}
      />
      <List
        title="Validators"
        data={validators}
        itemsPerPage={itemsPerPage}
        currentPage={validatorsPage}
        onPageChange={setValidatorsPage}
      />
      <List
        title="Delegators"
        data={delegators}
        itemsPerPage={itemsPerPage}
        currentPage={delegatorsPage}
        onPageChange={setDelegatorsPage}
      />
    </div>
  );
}

export default App;
