import React from "react";
import NodeList from "./components/NodeList";
import DelegatorList from "./components/DelegatorList";
import ValidatorList from "./components/ValidatorList";
import "./App.scss";

function App() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <NodeList />
      </div>
      <div>
        <DelegatorList />
      </div>
      <div>
        <ValidatorList />
      </div>
    </div>
  );
}

export default App;
