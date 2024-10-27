import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
} from "recharts";

function BigChart({ graphData, tasksCreated, tasksFinished, additionalLines }) {
 
  const firstTaskBlock =
    tasksCreated.length > 0 ? tasksCreated[0].blockNumber : 0;
  const startBlock = firstTaskBlock > 100000 ? firstTaskBlock - 100000 : 0;

  return (
    <LineChart
      width={1300}
      height={400}
      data={graphData}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="blockNumber"
        type="number"
        domain={[startBlock, "dataMax"]}
      >
        <Label value="Block Number" offset={-5} position="insideBottom" />
      </XAxis>
      <YAxis />
      <Tooltip />
      <Legend layout="horizontal" verticalAlign="top" align="center" />

      {/* Primary Line */}
      {graphData.length > 0 && (
        <Line
          type="monotone"
          dataKey="amount" 
          stroke="#ffce21"
          dot={false}
        />
      )}

      {additionalLines &&
        additionalLines.map((line, index) => (
          <Line
            key={`additional-line-${index}`}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            dot={false}
          />
        ))}

      {tasksCreated.map((task, index) => (
        <ReferenceLine
          key={`created-${task.blockNumber}-${index}`}
          x={task.blockNumber}
          stroke="#32a852"
          label={{
            value: ` ${task.taskId}`,
            position: "top",
            fill: "#32a852",
            fontSize: 10,
            dy: -10,
          }}
          strokeDasharray="3 3"
        />
      ))}

      {tasksFinished.map((task, index) => (
        <ReferenceLine
          key={`finished-${task.blockNumber}-${index}`}
          x={task.blockNumber}
          stroke="#ff0000"
          label={{
            value: ` ${task.taskId}`,
            position: "top",
            fill: "#ff0000",
            fontSize: 10,
            dy: -10,
          }}
          strokeDasharray="3 3"
        />
      ))}
    </LineChart>
  );
}

export default BigChart;
