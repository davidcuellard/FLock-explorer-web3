import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  Label,
} from "recharts";

function NiceChart({ graphData }) {
  return (
    <LineChart
      width={600}
      height={300}
      data={graphData}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="blockNumber">
        <Label value="Block Number" offset={-5} position="insideBottom" />
      </XAxis>
      <YAxis />
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="top" align="center" />
      <Line type="monotone" dataKey="amount" stroke="#ffce21">
        <LabelList dataKey="taskId" position="top" />
      </Line>
    </LineChart>
  );
}

export default NiceChart;
