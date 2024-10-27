import React, { useEffect, useState } from "react";
import List from "./List";
import { getNodes } from "../api";

function Nodes() {
    const [nodes, setNodes] = useState([]);
  const [nodesPage, setNodesPage] = useState(1);
  const itemsPerPage = 10;
  

    const fetchData = async () => {
      setNodes(await getNodes(nodesPage, itemsPerPage));
      
    };
  
  useEffect(() => {
    fetchData();
  }, [nodesPage]);


  return (
    <List
      title="Nodes"
      data={nodes}
      itemsPerPage={itemsPerPage}
      currentPage={nodesPage}
      onPageChange={setNodesPage}
    />
  );
}

export default Nodes;
