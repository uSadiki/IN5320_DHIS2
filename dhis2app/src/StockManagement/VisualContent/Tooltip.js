// Tooltip.js

import React from 'react';

const Tooltip = () => {
  return (
    <div className="tooltip-container">
      <div className="tooltip-content">
        <div className="stockout-container">
          <h2>Stockout Categories</h2>

          <div className="stockout-category">
            <strong>Healthy:</strong> The item's end balance is in good condition, meeting or exceeding the historical average.
            <span className="stockout-category-info">(No immediate action required)</span>
          </div>
          <div className="stockout-category">
            <strong>Moderate:</strong> The current average is greater than 50% of the historical average.
            <span className="stockout-category-info">(Monitor and consider additional stock)</span>
          </div>
          <div className="stockout-category">
            <strong>Critical:</strong> The current average is less than or equal to 50% of the historical average.
            <span className="stockout-category-info">(Urgent action required)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
