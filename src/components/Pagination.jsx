import React from 'react';

const Pagination = ({ page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center mt-4" id="pagination">
        <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page - 1)}>&laquo;</button>
        </li>
        {pages.map(num => (
          <li key={num} className={`page-item${page === num ? ' active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange(num)}>{num}</button>
          </li>
        ))}
        <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(page + 1)}>&raquo;</button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
