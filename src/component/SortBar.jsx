// import React from 'react';
// import '../css/SortBar.css'
// export default function SortBar({ total }) {
//   return (
//     <div className="sort-bar">
//       <span>Showing 1–{total} results</span>
//       <select>
//         <option value="latest">Sort by: Latest</option>
//         <option value="priceLow">Price: Low to High</option>
//         <option value="priceHigh">Price: High to Low</option>
//       </select>
//     </div>
//   );
// }


import React from "react";
import '../css/SortBar.css'

export default function SortBar({ total, onSortChange, currentSort }) {
  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    onSortChange(sortValue);
  };

  return (
    <div className="sort-bar">
      <div className="sort-info">
        Show 1–{Math.min(total, 15)} of {total} Results
      </div>
      <div className="sort-select">
        Sort By&nbsp;
        <select value={currentSort} onChange={handleSortChange}>
          <option value="latest">Latest</option>
          <option value="lowToHigh">Price: Low to High</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
}

