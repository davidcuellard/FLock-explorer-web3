import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNodeDetails } from "../api";

function NodeDetails() {
  const { id: nodeId } = useParams();
  const [node, setNode] = useState(null);

  console.log(node)

  useEffect(() => {
    async function fetchNodeDetails() {
      try {
        const data = await getNodeDetails(nodeId);
        setNode(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNodeDetails();
  }, [nodeId]);

  if (!node) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Node Details for ID: {node.address}</h1>
      <p>Task Ids: {node.taskIds.join(", ")}</p>
      <p>Total Stakes: {node.totalStakes}</p>
    </div>
  );
}

export default NodeDetails;
