// // components/CourseCard.jsx
// import React from 'react';
// import { FiHeart, FiShoppingCart } from 'react-icons/fi';
// import '../css/CourseCard.css';

// export default function CourseCard({ data, onAddToCart, onAddToWishlist }) {
//   const tags =
//     data.type === "resource"
//       ? ["Resource Only"]
//       : data.type === "live"
//       ? ["Live Sessions", data.schedule === "flexible" ? "Flexible" : "Fixed"]
//       : [];

//   const tagStyle = (tag) => {
//     if (tag === 'Resource Only') return { backgroundColor: '#4EBEDC', color: '#fff' };
//     if (tag === 'Live Sessions') return { backgroundColor: '#5D5BDF', color: '#fff' };
//     if (tag === 'Flexible') return { backgroundColor: '#FFF0BD', color: '#131313' };
//     if (tag === 'Fixed') return { backgroundColor: '#C6C5FF', color: '#131313' };
//   };

//   return (
//     <div className="course-card">
//       <div className="card-image">
//         <img src={data.image} alt={data.title} />
//         <div className="icon heart" onClick={() => onAddToWishlist(data)}><FiHeart /></div>
//         <div className="icon cart" onClick={() => onAddToCart(data)}><FiShoppingCart /></div>
//       </div>

//       <h2 className="card-title">{data.title}</h2>
//       <p className="card-desc">{data.description}</p>
//       <p className="card-category">{data.category}</p>

//       <div className="card-price">
//         <span className="new">${data.discountPrice}</span>
//         <span className="old">${data.originalPrice}</span>
//       </div>

//       <div className="card-tags">
//         {tags.map((t, i) => (
//           <span key={i} className="tag" style={tagStyle(t)}>{t}</span>
//         ))}
//       </div>
//     </div>
//   );
// }
import React from 'react';
import '../css/CourseCard.css';
import { useNavigate, Link } from 'react-router-dom';

export default function CourseCard({ data }) {
  const navigate = useNavigate();

  // Function to render HTML content safely
  const renderHTML = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Function to strip HTML tags for text-only display
  const stripHTML = (htmlContent) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = htmlContent;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleReadMore = () => {
    const categorySlug = (data.category || 'general')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const titleSlug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const blogUrl = `/blog1/${categorySlug}/${titleSlug}`;
    console.log('CourseCard navigating to:', blogUrl);
    navigate(blogUrl);
  };

  return (
    <div className="course-card">
      <div className="card-image">
        <img src={data.image} alt={data.title} />
      </div>

      {/* Category and Date Row */}
      <div className="card-meta">
        <span className="card-category">{data.category}</span>
        <span className="card-date">{data.date}</span>
      </div>

      <h2 className="card-title">{data.title}</h2>

      {/* Display description with HTML support */}
      <div
        className="card-desc"
        dangerouslySetInnerHTML={renderHTML(data.description)}
      />

      <Link
        to={`/blog1/${(data.category || 'general').toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')}/${data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')}`}
        className="read-more"
        style={{ color: '#6600CC', fontWeight: '700', fontSize: '16px', textDecoration: 'none' }}
        onClick={() => console.log('CourseCard Link clicked for:', data.title)}
      >
        Read More...
      </Link>
    </div>
  );
}
