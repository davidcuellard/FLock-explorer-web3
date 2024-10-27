import React, { useEffect, useState } from "react";
import List from "./List";
import { getDelegators } from "../api";

function Delegators() {
  const [delegators, setDelegators] = useState([]);
  const [delegatorsPage, setDelegatorsPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setDelegators(await getDelegators(delegatorsPage, itemsPerPage));
  };

  useEffect(() => {
    fetchData();
  }, [delegatorsPage]);

  return (
    <List
      title="Validators"
      data={delegators}
      itemsPerPage={itemsPerPage}
      currentPage={delegatorsPage}
      onPageChange={setDelegatorsPage}
    />
  );
}

export default Delegators;
