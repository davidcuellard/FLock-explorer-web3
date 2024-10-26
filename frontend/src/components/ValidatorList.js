import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";

function ValidatorList() {
  const [validators, setValidators] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    async function fetchValidators() {
      const response = await axios.get(
        `/api/validators?page=${page}&limit=${limit}`
      );
      setValidators(response.data);
    }
    fetchValidators();
  }, [page]);

  const nextPage = () => setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <div>
      <h2>Validators</h2>
      {validators.map((validator) => (
        <Item
          key={validator.address}
          address={validator.address}
          totalStakes={validator.totalStakes}
          type="validator"
        />
      ))}
      <div>
        <button onClick={prevPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}

export default ValidatorList;
