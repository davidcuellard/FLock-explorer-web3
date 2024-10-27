import React from "react";
import { Link } from "react-router-dom";

function Visualizer() {
  return (
    <div className="visualizer-page">
      <nav className="submenu">
        <Link to="/stake-tracking">Stake Tracking</Link>
        <Link to="/delegator-participation">Delegator Participation</Link>
        <Link to="/rewards-distribution">Rewards Distribution</Link>
      </nav>
    </div>
  );
}

export default Visualizer;
