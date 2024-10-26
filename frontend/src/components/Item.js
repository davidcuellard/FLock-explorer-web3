import React from "react";

function Item({ address, totalStakes, type }) {
  return (
    <div>
      <h2>
        {type.charAt(0).toUpperCase() + type.slice(1)} Address: {address}
      </h2>
      <p>Total Stake: {totalStakes}</p>
      <a href={`/${type}/${address}`}>View Details</a>
    </div>
  );
}

export default Item;
