import React from 'react';

const ButtonComponent = ({ currentPage, setCurrentPage, data, itemsPerPage }) => (
  <div className="pagination-container">
    <button
      className="pagination-button"
      onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
      disabled={currentPage === 1}
    >
      Previous
    </button>
    <span className="pagination-info">Page {currentPage} of {Math.ceil(Object.entries(data).length / itemsPerPage)}</span>
    <button
      className="pagination-button"
      onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(Object.entries(data).length / itemsPerPage)))}
      disabled={currentPage === Math.ceil(Object.entries(data).length / itemsPerPage)}
    >
      Next
    </button>
  </div>
);

export default ButtonComponent;