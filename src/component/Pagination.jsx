// import React from 'react';
// import '../css/Pagination.css'
// export default function Pagination() {
//   return (
//     <div className="pagination">
//       <button>{"<"}</button>
//       <button className="active">1</button>
//       <button>2</button>
//       <button>Next</button>
//     </div>
//   );
// }
// import React from 'react';
// import '../css/Pagination.css'

// export default function Pagination({ currentPage, totalPages, onPageChange }) {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="pagination">
//       {pages.map((page) => (
//         <button
//           key={page}
//           className={page === currentPage ? 'active' : ''}
//           onClick={() => onPageChange(page)}
//         >
//           {page}
//         </button>
//       ))}
//       {currentPage < totalPages && (
//         <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
//       )}
//     </div>
//   );
// }


// import React from 'react';
// import '../css/Pagination.css'

// export default function Pagination({ currentPage, totalPages, onPageChange }) {
//   const visiblePages = [];

//   if (totalPages <= 5) {
//     for (let i = 1; i <= totalPages; i++) {
//       visiblePages.push(i);
//     }
//   } else {
//     visiblePages.push(1);
//     visiblePages.push(2);
//     visiblePages.push(3);

//     if (totalPages > 4) {
//       visiblePages.push('dots');
//       visiblePages.push(totalPages);
//     }
//   }

//   const handlePageChange = (page) => {
//     if (page !== 'dots') {
//       onPageChange(page);
//     }
//   };

//   return (
//     <div className="pagination">
//       <button
//         className={currentPage === 1 ? 'disabled' : ''}
//         onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         Prev
//       </button>

//       {visiblePages.map((page, index) => (
//         <button
//           key={index}
//           className={
//             page === currentPage
//               ? 'active'
//               : page === 'dots'
//               ? 'dots'
//               : ''
//           }
//           onClick={() => handlePageChange(page)}
//           disabled={page === 'dots'}
//         >
//           {page === 'dots' ? '...' : page}
//         </button>
//       ))}

//       <button
//         className={currentPage === totalPages ? 'disabled' : ''}
//         onClick={() =>
//           currentPage < totalPages && onPageChange(currentPage + 1)
//         }
//         disabled={currentPage === totalPages}
//       >
//         Next
//       </button>
//     </div>
//   );
// }

import React from 'react';
import '../css/Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const visiblePages = [];

  // Always show first 3 pages
  for (let i = 1; i <= 3 && i <= totalPages; i++) {
    visiblePages.push(i);
  }

  // Show ellipsis if totalPages > 4
  if (totalPages > 4) {
    visiblePages.push('dots');
    visiblePages.push(totalPages);
  }

  const handlePageChange = (page) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button
        className={currentPage === 1 ? 'disabled' : ''}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {visiblePages.map((page, index) => (
        <button style={{border:'2px solid #F1F1F1'}}
          key={index}
          className={
            page === currentPage
              ? 'active'
              : page === 'dots'
              ? 'dots'
              : ''
          }
          onClick={() => handlePageChange(page)}
          disabled={page === 'dots'}
        >
          {page === 'dots' ? '...' : page}
        </button>
        
      ))}

      <button
        className={currentPage === totalPages ? 'disabled' : ''}
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}
