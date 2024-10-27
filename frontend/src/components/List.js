import React from "react";
import PropTypes from "prop-types";
import { formatNumber } from "../utils/formatNumber";

function List({ title, data, currentPage, onPageChange, itemsPerPage }) {
  
  const handlePreviousPage = () => {
    onPageChange((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange((prevPage) => prevPage + 1);
  };

  return (
    <div className="list-container">

      <h2>{title}</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th>Address</th>
            {data[0]?.rewardAmount && <th>Rewards Claimed</th>}

            <th>Total Stake</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.address}>
              <td>{item.address}</td>
              {data[0]?.rewardAmount && (
                <td>{formatNumber(item.rewardAmount)}</td>
              )}

              <td>{formatNumber(item.totalStakes)}</td>
              <td>
                <a
                  href={`/${title.toLowerCase()}/${item.address}`}
                  className="view-button"
                >
                  View Details
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="page-button"
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={handleNextPage} className="page-button">
          Next
        </button>
      </div>
    </div>
  );
}

List.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      address: PropTypes.string.isRequired,
      totalStakes: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
};

export default List;
