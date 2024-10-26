import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function formatStake(value) {
  const number = Number(value);
  if (number === 0) return "0";
  const exponent = Math.floor(Math.log10(Math.abs(number)));
  const base = (number / Math.pow(10, exponent)).toFixed(2);
  return `${base} x 10^${exponent}`;
}

function List({ title, data, currentPage, onPageChange, itemsPerPage }) {
    const navigate = useNavigate();
  const handlePreviousPage = () => {
    onPageChange((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    onPageChange((prevPage) => prevPage + 1);
  };

  return (
    <div className="list-container">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>{title}</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th>Address</th>
            <th>Total Stake</th>
            <th>View Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.address}>
              <td>{item.address}</td>
              <td>{formatStake(item.totalStakes)}</td>
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
