// import React, {useEffect} from "react";
// import './ProductDetail.css'

// import { useBanner } from "../../context/BannerContext";
// import { FiShoppingCart, FiHeart } from 'react-icons/fi';
// import FaqSection from "../../component/FaqSection";

// import ReviewSection from '../../component/ReviewSection';
// export default function ProductDetail() {
//     const faqs = [
//   { question: "Apakah kursus ini benar-benar gratis?", answer: "Kursus yang disediakan bisa diakses gratis untuk menunjang kebutuhan dalam bidang kependidikan." },
//   { question: "Untuk siapa kursus ini?", answer: "Kursus ini cocok untuk pelajar, mahasiswa, dan profesional." },
//   { question: "Apakah mendapatkan sertifikat?", answer: "Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan kursus." }
// ];
// const reviews = [
//   {
//     name: "Mark Doe",
//     stars: 5,
//     comment: "Video lectures were engaging and real-world examples helped solidify my understanding.",
//     date: "22nd March, 2024",
//     avatar: "https://i.pravatar.cc/150?img=1"
//   },
//   {
//     name: "Mark Doe",
//     stars: 4,
//     comment: "Great instructor and very well structured content.",
//     date: "22nd March, 2024",
//     avatar: "https://i.pravatar.cc/150?img=2"
//   }
// ];

//     const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
//        useEffect(() => {
//           setBannerTitle("Booking");
//           setBreadcrumb("Booking");
//           setBannerImage("/other-banner.png");
//         }, []);
//   return (
//     <div>
//     <div className="product-course-preview-container">
//       {/* Image Section */}
//       <div className="product-course-preview-image">
//         <img src="/product1.png" alt="Trainer" />
//       </div>

//       {/* Details Section */}
//       <div className="product-course-preview-details">
//         <div className="product-badge-container">
//         <span className="badge">Resouce Only</span>
//          <div className="rating-section">
//     {[1, 2, 3, 4, 5].map((star, index) => (
//       <span
//         key={index}
//         className={`p-star ${index < 4 ? 'filled' : ''}`}
//       >★</span>
//     ))}
//     <span className="review-count">(5k+ Reviews)</span>
//   </div>
//         </div>

//         <h2 className="product-course-title">Tentang Kursus</h2>
//         <p className="product-course-category">Category 1</p>
//         <p className="product-course-price">
//           <span className="product-old-price">$97</span> <span className="product-new-price">$67</span>
//         </p>
//         <p className="product-course-description">
//           Pemrograman web atau web programming adalah istilah yang berkaitan erat dengan website dan internet.
//           Mengapa begitu? Karena web programming adalah salah satu proses pembuatan website untuk keperluan internet...
//         </p>
//         <p className="product-course-description">
//           Dalam kursus ini kamu akan diajarkan cara membuat web dengan standar industri. Di sini kamu akan diajarkan tentang Html, Css dan Javascript...
//         </p>

//         {/* Buttons */}
//         <div className="product-course-preview-buttons">
//           <button className="product-wishlist-btn"><FiHeart /></button>
//           <button className="product-cart-btn">
//             Add to Cart <FiShoppingCart />
//           </button>
//         </div>
//       </div>

//     </div>
//     <div className="faq-reviews-container">
//       <div className="tabs">
//         <button className="active-tab">Faqs</button>
//         <button>Reviews</button>
//       </div>
//       <FaqSection faqs={faqs} />
//       <ReviewSection reviews={reviews} rating={4.5} />
//     </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import "./ProductDetail.css";

// import { useBanner } from "../../context/BannerContext";
// import { FiShoppingCart, FiHeart } from "react-icons/fi";
// import FaqSection from "../../component/FaqSection";
// import ReviewSection from "../../component/ReviewSection";

// export default function ProductDetail() {
//   const [activeTab, setActiveTab] = useState("faqs"); // NEW state for tabs

//   const faqs = [
//     {
//       question: "Apakah kursus ini benar-benar gratis?",
//       answer:
//         "Kursus yang disediakan bisa diakses gratis untuk menunjang kebutuhan dalam bidang kependidikan.",
//     },
//     {
//       question: "Untuk siapa kursus ini?",
//       answer: "Kursus ini cocok untuk pelajar, mahasiswa, dan profesional.",
//     },
//     {
//       question: "Apakah mendapatkan sertifikat?",
//       answer: "Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan kursus.",
//     },
//   ];

//   const reviews = [
//     {
//       name: "Mark Doe",
//       stars: 5,
//       comment: "Video lectures were engaging and real-world examples helped solidify my understanding.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=1",
//     },
//     {
//       name: "Mark Doe",
//       stars: 4,
//       comment: "Great instructor and very well structured content.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=2",
//     },{
//       name: "Mark Doe",
//       stars: 4,
//       comment: "Great instructor and very well structured content.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=2",
//     },{
//       name: "Mark Doe",
//       stars: 4,
//       comment: "Great instructor and very well structured content.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=2",
//     },
//   ];

//   const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();

//   useEffect(() => {
//     setBannerTitle("Booking");
//     setBreadcrumb("Booking");
//     setBannerImage("/other-banner.png");
//   }, []);

//   return (
//     <div>
//       <div className="product-course-preview-container">
//         {/* Image Section */}
//         <div className="product-course-preview-image">
//           <img src="/product1.png" alt="Trainer" />
//         </div>

//         {/* Details Section */}
//         <div className="product-course-preview-details">
//           <div className="product-badge-container">
//             <span className="badge">Resouce Only</span>
//             <div className="rating-section">
//               {[1, 2, 3, 4, 5].map((star, index) => (
//                 <span key={index} className={`p-star ${index < 4 ? "filled" : ""}`}>
//                   ★
//                 </span>
//               ))}
//               <span className="review-count">(5k+ Reviews)</span>
//             </div>
//           </div>

//           <h2 className="product-course-title">Tentang Kursus</h2>
//           <p className="product-course-category">Category 1</p>
//           <p className="product-course-price">
//             <span className="product-old-price">$97</span>{" "}
//             <span className="product-new-price">$67</span>
//           </p>
//           <p className="product-course-description">
//             Pemrograman web atau web programming adalah istilah yang berkaitan erat dengan website
//             dan internet. Mengapa begitu? Karena web programming adalah salah satu proses pembuatan
//             website untuk keperluan internet...
//           </p>
//           <p className="product-course-description">
//             Dalam kursus ini kamu akan diajarkan cara membuat web dengan standar industri. Di sini
//             kamu akan diajarkan tentang Html, Css dan Javascript...
//           </p>

//           {/* Buttons */}
//           <div className="product-course-preview-buttons">
//             <button className="product-wishlist-btn">
//               <FiHeart />
//             </button>
//             <button className="product-cart-btn">
//               Add to Cart <FiShoppingCart />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* FAQ and Review Tabs */}
//       <div className="faq-reviews-container">
//         <div className="tabs">
//           <button
//             className={activeTab === "faqs" ? "active-tab" : ""}
//             onClick={() => setActiveTab("faqs")}
//           >
//             FAQs
//           </button>
//           <button
//             className={activeTab === "reviews" ? "active-tab" : ""}
//             onClick={() => setActiveTab("reviews")}
//           >
//             Reviews
//           </button>
//         </div>

//         <div className="tab-content">
//           {activeTab === "faqs" && <FaqSection faqs={faqs} />}
//           {activeTab === "reviews" && <ReviewSection reviews={reviews} rating={4.5} />}
//         </div>
//       </div>
//     </div>
//   );
// }



1.
// import React, { useEffect, useState } from "react";
// import "./ProductDetail.css";
// import { useLocation, useParams } from "react-router-dom";
// import { useBanner } from "../../context/BannerContext";
// import { FiShoppingCart, FiHeart } from "react-icons/fi";
// import FaqSection from "../../component/FaqSection";
// import ReviewSection from "../../component/ReviewSection";
// import SessionTimingModal from "../../component/SessionTimingModal";

// export default function ProductDetail() {
//     const [modalOpen, setModalOpen] = useState(false);
//   const { id } = useParams();
//   const location = useLocation();
//   const product = location.state?.product;

//   const [activeTab, setActiveTab] = useState("faqs");

//   const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();

//   useEffect(() => {
//     setBannerTitle("Product Detail");
//     setBreadcrumb("Product Detail");
//     setBannerImage("/other-banner.png");
//   }, []);

//   // Dummy fallback (if accessed via URL directly)
//   const fallbackProduct = {
//     title: "Tentang Kursus",
//     category: "Category 1",
//     oldPrice: "$97",
//     newPrice: "$67",
//     description1:
//       "Pemrograman web atau web programming adalah...",
//     description2: "Dalam kursus ini kamu akan diajarkan cara membuat web...",
//     image: "/product1.png",
//     badge: "Resource Only",
//     rating: 4,
//     reviews: "5k+ Reviews",
//   };

//   const selected = product || fallbackProduct;

//    const faqs = [
//     {
//       question: "Apakah kursus ini benar-benar gratis?",
//       answer:
//         "Kursus yang disediakan bisa diakses gratis untuk menunjang kebutuhan dalam bidang kependidikan.",
//     },
//     {
//       question: "Untuk siapa kursus ini?",
//       answer: "Kursus ini cocok untuk pelajar, mahasiswa, dan profesional.",
//     },
//     {
//       question: "Apakah mendapatkan sertifikat?",
//       answer: "Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan kursus.",
//     },
//   ];

//   const reviews = [
//     {
//       name: "Mark Doe",
//       stars: 5,
//       comment: "Video lectures were engaging and real-world examples helped solidify my understanding.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=1",
//     },
//     {
//       name: "Mark Doe",
//       stars: 4,
//       comment: "Great instructor and very well structured content.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=2",
//     },{
//       name: "Mark Doe",
//       stars: 4,
//       comment: "Great instructor and very well structured content.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=2",
//     },{
//       name: "Mark Doe",
//       stars: 4,
//       comment: "Great instructor and very well structured content.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=2",
//     },
//   ];

//   return (
//     <div>
//       <div className="product-course-preview-container">
//         <div className="product-course-preview-image">
//           <img src={selected.image} alt="Trainer" />
//         </div>

//         <div className="product-course-preview-details">
//           <div className="product-badge-container">
//             <span className="badge">{selected.badge}</span>
//             <div className="rating-section">
//               {[1, 2, 3, 4, 5].map((star, index) => (
//                 <span
//                   key={index}
//                   className={`p-star ${
//                     index < selected.rating ? "filled" : ""
//                   }`}
//                 >
//                   ★
//                 </span>
//               ))}
//               <span className="review-count">({selected.reviews})</span>
//             </div>
//           </div>

//           <h2 className="product-course-title">{selected.title}</h2>
//           <p className="product-course-category">{selected.category}</p>
//           <p className="product-course-price">
//             <span className="product-old-price">{selected.oldPrice}</span>{" "}
//             <span className="product-new-price">{selected.newPrice}</span>
//           </p>
//           <p className="product-course-description">{selected.description1}</p>
//           <p className="product-course-description">{selected.description2}</p>

//           {/* <div className="product-course-preview-buttons">
//              <a href="#sessions" className="session-link-btn">
//     View Session Timings
//   </a>
//             <button className="product-wishlist-btn">
//               <FiHeart />
//             </button>
//             <button className="product-cart-btn">
//               Add to Cart <FiShoppingCart />
//             </button>
//           </div> */}
//           <div className="product-course-action-wrapper">
//   <a href="#" className="session-link-btn"  onClick={() => setModalOpen(true)}>View Session Timings</a>

//   <div className="product-course-preview-buttons">
//     <button className="product-wishlist-btn"><FiHeart /></button>
//     <button className="product-cart-btn">
//       <FiShoppingCart /> Add to Cart
//     </button>
//   </div>
// </div>

//         </div>
//       </div>

//       {/* FAQ and Reviews Section */}
//       <div className="faq-reviews-container">
//         <div className="tabs">
//           <button
//             className={activeTab === "faqs" ? "active-tab" : ""}
//             onClick={() => setActiveTab("faqs")}
//           >
//             FAQs
//           </button>
//           <button
//             className={activeTab === "reviews" ? "active-tab" : ""}
//             onClick={() => setActiveTab("reviews")}
//           >
//             Reviews
//           </button>
//         </div>

//         <div className="tab-content">
//           {activeTab === "faqs" && <FaqSection faqs={faqs} />}
//           {activeTab === "reviews" && (
//             <ReviewSection reviews={reviews} rating={4.5} />
//           )}
//         </div>
//       </div>
//       <SessionTimingModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import "./ProductDetail.css";
// import { useLocation, useParams } from "react-router-dom";
// import { useBanner } from "../../context/BannerContext";
// import { useCart } from "../../context/CartContext";
// import { useWishlist } from "../../context/WishlistContext";
// import FaqSection from "../../component/FaqSection";
// import ReviewSection from "../../component/ReviewSection";
// import SessionTimingModal from "../../component/SessionTimingModal";
// import { FiShoppingCart, FiHeart } from "react-icons/fi";

// export default function ProductDetail() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const { id } = useParams();
//   const location = useLocation();
//   const product = location.state?.product;

//   const { addToCart } = useCart();
//   const { addToWishlist } = useWishlist();

//   const [activeTab, setActiveTab] = useState("faqs");
//   const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();

//   useEffect(() => {
//     setBannerTitle("Product Detail");
//     setBreadcrumb("Product Detail");
//     setBannerImage("/other-banner.png");
//   }, []);

//   const fallbackProduct = {
//     id: "default",
//     title: "Tentang Kursus",
//     category: "Category 1",
//     discountPrice: "$97",
//     originalPrice: "$67",
//     description1: "Pemrograman web atau web programming adalah...",
//     description2: "Dalam kursus ini kamu akan diajarkan cara membuat web...",
//     image: "/product1.png",
//     badge: "Resource Only",
//     rating: 4,
//     reviews: "5k+ Reviews",
//   };

//   const selected = product || fallbackProduct;

//   const faqs = [
//     {
//       question: "Apakah kursus ini benar-benar gratis?",
//       answer:
//         "Kursus yang disediakan bisa diakses gratis untuk menunjang kebutuhan dalam bidang kependidikan.",
//     },
//     {
//       question: "Untuk siapa kursus ini?",
//       answer: "Kursus ini cocok untuk pelajar, mahasiswa, dan profesional.",
//     },
//     {
//       question: "Apakah mendapatkan sertifikat?",
//       answer: "Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan kursus.",
//     },
//   ];

//   const reviews = [
//     {
//       name: "Mark Doe",
//       stars: 5,
//       comment: "Video lectures were engaging and real-world examples helped solidify my understanding.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=1",
//     },
//     {
//       name: "Jane Smith",
//       stars: 4,
//       comment: "Great instructor and very well structured content.",
//       date: "22nd March, 2024",
//       avatar: "https://i.pravatar.cc/150?img=2",
//     },
//   ];

//   return (
//     <div>
//       <div className="product-course-preview-container">
//         <div className="product-course-preview-image">
//           <img src={selected.image} alt="Trainer" />
//         </div>

//         <div className="product-course-preview-details">
//           <div className="product-badge-container">
//             <span className="badge">{selected.badge}</span>
//             <div className="rating-section">
//               {[1, 2, 3, 4, 5].map((star, index) => (
//                 <span
//                   key={index}
//                   className={`p-star ${index < selected.rating ? "filled" : ""}`}
//                 >
//                   ★
//                 </span>
//               ))}
//               <span className="review-count">({selected.reviews})</span>
//             </div>
//           </div>

//           <h2 className="product-course-title">{selected.title}</h2>
//           <p className="product-course-category">{selected.category}</p>
//           <p className="product-course-price">
//             <span className="product-old-price">{selected.discountPrice}</span>{" "}
//             <span className="product-new-price">{selected.originalPrice}</span>
//           </p>
//           <p className="product-course-description">{selected.description1}</p>
//           <p className="product-course-description">{selected.description2}</p>

//           <div className="product-course-action-wrapper">
//             <a
//               href="#"
//               className="session-link-btn"
//               onClick={() => setModalOpen(true)}
//             >
//               View Session Timings
//             </a>

//             <div className="product-course-preview-buttons">
//               <button
//                 className="product-wishlist-btn"
//                 onClick={() => addToWishlist(selected)}
//               >
//                 <FiHeart />
//               </button>
//               <button
//                 className="product-cart-btn"
//                 onClick={() => addToCart(selected)}
//               >
//                 <FiShoppingCart /> Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* FAQ and Reviews Section */}
//       <div className="faq-reviews-container">
//         <div className="tabs">
//           <button
//             className={activeTab === "faqs" ? "active-tab" : ""}
//             onClick={() => setActiveTab("faqs")}
//           >
//             FAQs
//           </button>
//           <button
//             className={activeTab === "reviews" ? "active-tab" : ""}
//             onClick={() => setActiveTab("reviews")}
//           >
//             Reviews
//           </button>
//         </div>

//         <div className="tab-content">
//           {activeTab === "faqs" && <FaqSection faqs={faqs} />}
//           {activeTab === "reviews" && (
//             <ReviewSection reviews={reviews} rating={4.5} />
//           )}
//         </div>
//       </div>

//       <SessionTimingModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//       />
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useBanner } from "../../context/BannerContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useTraining } from "../../context/TrainingContext";
import FaqSection from "../../component/FaqSection";
import ReviewSection from "../../component/ReviewSection";
import SessionTimingModal from "../../component/SessionTimingModal";
import AuthModal from "../../component/AuthModal";
import Toast from "../../component/Toast";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

export default function ProductDetail() {
  const [modalOpen, setModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Toast notification states
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getTrainingById } = useTraining();

  const product = location.state?.product || getTrainingById(id);

  const { addToCart, loading: cartLoading, error: cartError } = useCart();
  const { addToWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("");
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();

  useEffect(() => {
    if (product) {
      setBannerTitle("Product Detail");
      setBreadcrumb("Product Detail");
      setBannerImage("/other-banner.png");
      console.log("product", product);
      console.log("enableFaqs:", product.enableFaqs);
      console.log("enableReviews:", product.enableReviews);
      
      // Set default active tab based on which sections are enabled
      if (product.enableFaqs) {
        setActiveTab("faqs");
      } else if (product.enableReviews) {
        setActiveTab("reviews");
      } else {
        setActiveTab("");
      }
    }
  }, [product, setBannerTitle, setBreadcrumb, setBannerImage]);

  // If no product found, redirect to training page
  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/training')} className="back-button">
          Back to Training
        </button>
      </div>
    );
  }

  const selected = product;

  // Use FAQs from API data if available, otherwise use default FAQs
  const faqs = selected.faqs && selected.faqs.length > 0
    ? selected.faqs.map(faq => ({
      question: faq.heading,
      answer: faq.description
    }))
    : [
      {
        question: "Apakah kursus ini benar-benar gratis?",
        answer:
          "Kursus yang disediakan bisa diakses gratis untuk menunjang kebutuhan dalam bidang kependidikan.",
      },
      {
        question: "Untuk siapa kursus ini?",
        answer: "Kursus ini cocok untuk pelajar, mahasiswa, dan profesional.",
      },
      {
        question: "Apakah mendapatkan sertifikat?",
        answer: "Ya, Anda akan mendapatkan sertifikat digital setelah menyelesaikan kursus.",
      },
    ];



  return (
    <div>
      <div className="product-course-preview-container">
        <div className="product-course-preview-image">
          <img src={selected.image} alt={selected.title} />
        </div>

        <div className="product-course-preview-details">
          <div className="product-badge-container">
            {/* <span className="badge">
              {selected.type === "resource" ? "Resource Only" : "Live Sessions"}
            </span> */}

            {/* Tags */}
            <div className="product-tag-container">
              {selected.type === "resource" ? (
                <span className="badge">Resource Only</span>
              ) : selected.type === "live" && (
                <>
                  <span className="product-tag-live">Live Sessions</span>
                  <span
                    className="product-tag"
                    style={{
                      backgroundColor: selected.schedule === "flexible" ? "#FFF0BD" : "#9290F5",
                      color: selected.schedule === "flexible" ? "#000" : "#fff"
                    }}
                  >
                    {selected.schedule === "flexible" ? "Flexible" : "Fixed"}
                  </span>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="rating-section">
              {[1, 2, 3, 4, 5].map((star, index) => (
                <span
                  key={index}
                  className={`p-star ${index < (selected.rating || 4) ? "filled" : ""}`}
                >
                  ★
                </span>
              ))}
              <span className="review-count">
                ({selected.reviews || 0} Review{selected.reviews !== 1 ? 's' : ''})
              </span>
            </div>
          </div>

          <h2 className="product-course-title">{selected.title}</h2>
          <p className="product-course-category">{selected.category}</p>
          <p className="product-course-price">
            <span className="product-new-price">${selected.discountPrice}</span>{" "}
            <span className="product-old-price">${selected.originalPrice}</span>
          </p>
          <p className="product-course-description">{selected.description}</p>

          <div className="product-course-action-wrapper">
            {selected.type === "live" && (
              <>
                <div className="session-count">
                  No of Sessions: {selected.sessionCount || 0}
                </div>
                <a
                  href="#"
                  className="session-link-btn"
                  onClick={() => setModalOpen(true)}
                >
                  View Session Timings
                </a>
              </>
            )}

            <div className="product-course-preview-buttons">
              <button
                className="product-wishlist-btn"
                onClick={async () => {
                  // Check if user is authenticated
                  const token = localStorage.getItem('gg website token');
                  const user = localStorage.getItem('gg website user');

                  if (!token || !user) {
                    setShowAuthModal(true);
                    return;
                  }

                  const success = await addToWishlist(selected);
                  if (success) {
                    // Show success toast notification
                    setToastConfig({
                      isVisible: true,
                      message: `"${selected.title}" added to wishlist successfully! ❤️`,
                      type: 'wishlist'
                    });
                  } else {
                    // Show error toast notification
                    setToastConfig({
                      isVisible: true,
                      message: `"${selected.title}" is already in your wishlist! ❤️`,
                      type: 'error'
                    });
                  }
                }}
              >
                <FiHeart />
              </button>
              <button
                className="product-cart-btn"
                onClick={async () => {
                  // Check if user is authenticated
                  const token = localStorage.getItem('gg website token');
                  const user = localStorage.getItem('gg website user');

                  if (!token || !user) {
                    setShowAuthModal(true);
                    return;
                  }

                  const cartItem = {
                    id: selected.id,
                    title: selected.title,
                    price: selected.discountPrice,
                    originalPrice: selected.originalPrice,
                    image: selected.image,
                    badge: selected.badge || "Top Pick",
                    rating: selected.rating || 0,
                    reviews: selected.reviews || 0,
                    tag: selected.type === "resource"
                      ? ["Resource Only"]
                      : selected.type === "live"
                        ? [
                          "Live Sessions",
                          selected.schedule === "flexible" ? "Flexible" : "Fixed"
                        ]
                        : []
                  };
                  const success = await addToCart(cartItem);
                  if (success) {
                    // Show success toast notification
                    setToastConfig({
                      isVisible: true,
                      message: `"${selected.title}" added to cart successfully! 🛒`,
                      type: 'cart'
                    });
                  } else {
                    // Show error toast notification
                    setToastConfig({
                      isVisible: true,
                      message: `"${selected.title}" is already in your cart! 🛒`,
                      type: 'error'
                    });
                  }
                }}
              >
                <FiShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Slider - Now positioned below the entire product section */}
      {selected.gallery && selected.gallery.length > 0 && (
        <div className="gallery-slider">
          <div className="gallery-thumbnails">
            {selected.gallery.map((galleryItem, index) => (
              <div
                key={index}
                className="gallery-thumbnail"
                onClick={() => {
                  setSelectedGalleryImage(galleryItem.image);
                  setGalleryModalOpen(true);
                }}
              >
                <img src={galleryItem.image} alt={`Gallery ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ and Reviews Section - Only show if at least one is enabled */}
      {(selected.enableFaqs || selected.enableReviews) && (
        <div className="faq-reviews-container">
          <div className="tabs">
            {selected.enableFaqs && (
              <button
                className={activeTab === "faqs" ? "active-tab" : ""}
                onClick={() => setActiveTab("faqs")}
              >
                FAQs
              </button>
            )}
            {selected.enableReviews && (
              <button
                className={activeTab === "reviews" ? "active-tab" : ""}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            )}
          </div>

          <div className="tab-content">
            {activeTab === "faqs" && selected.enableFaqs && <FaqSection faqs={faqs} />}
            {activeTab === "reviews" && selected.enableReviews && (
              <ReviewSection 
                rating={selected.rating || 4} 
                courseId={selected.id} 
                onShowAuth={() => setShowAuthModal(true)}
              />
            )}
          </div>
        </div>
      )}

      <SessionTimingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sessions={selected.sessions || []}
      />

      {/* Gallery Modal */}
      {galleryModalOpen && selectedGalleryImage && (
        <div className="gallery-modal-overlay" onClick={() => setGalleryModalOpen(false)}>
          <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery-modal-close"
              onClick={() => setGalleryModalOpen(false)}
            >
              ✕
            </button>
            <img src={selectedGalleryImage} alt="Gallery" />
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="You need to be logged in to add reviews for this course."
      />
      
      {/* Toast Notification */}
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))}
        duration={3000}
      />
    </div>
  );
}
