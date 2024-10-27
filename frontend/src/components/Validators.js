import React, { useEffect, useState } from "react";
import List from "./List";
import { getValidators } from "../api";

function Validators() {
  const [validators, setValidators] = useState([]);
  const [validatorsPage, setValidatorsPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    setValidators(await getValidators(validatorsPage, itemsPerPage));
  };

  useEffect(() => {
    fetchData();
  }, [validatorsPage]);

  return (
    <List
      title="Validators"
      data={validators}
      itemsPerPage={itemsPerPage}
      currentPage={validatorsPage}
      onPageChange={setValidatorsPage}
    />
  );
}

export default Validators;
