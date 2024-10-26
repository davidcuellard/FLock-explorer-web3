import React, { useEffect, useState } from "react";
import { getNodePerformance } from "../api";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

function NodePerformanceChart({ nodeId }) {
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    async function fetchPerformanceData() {
      try {
        const data = await getNodePerformance(nodeId);
        setPerformanceData(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPerformanceData();
  }, [nodeId]);

  return (
    <LineChart width={600} height={300} data={performanceData}>
      <XAxis dataKey="timestamp" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="metric" stroke="#8884d8" />
    </LineChart>
  );
}

export default NodePerformanceChart;
