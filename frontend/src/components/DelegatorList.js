import React, { useEffect, useState } from "react";
import axios from "axios";
import Item from "./Item";

function DelegatorList() {
  const [delegators, setDelegators] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    async function fetchDelegators() {
      const response = await axios.get(
        `/api/delegators?page=${page}&limit=${limit}`
      );
      setDelegators(response.data);
    }
    fetchDelegators();
  }, [page]);

  const nextPage = () => setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  return (
    <div>
      <h2>Delegators</h2>
      {delegators.map((delegator) => (
        <Item
          key={delegator.address}
          address={delegator.address}
          totalStakes={delegator.totalStakes}
          type="delegator"
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

export default DelegatorList;
