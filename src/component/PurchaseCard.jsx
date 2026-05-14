import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PurchaseCard.css";

const PurchaseCard = ({ purchaseData }) => {
  const { id, status, date, price, items } = purchaseData;
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStatusClass = (status) => {
    const s = status?.trim().toLowerCase();
    if (s === "completed") return "status-completed";
    if (s === "not complete") return "status-processing";
    return "";
  };

  const getContentTagClass = (content) => {
    const c = content?.trim().toLowerCase();
    if (c === "resource only") return "purchase-card-tag bg-resource";
    if (c === "live session") return "purchase-card-tag bg-live";
    return "purchase-card-tag";
  };

  const getTimeTagClass = (time) => {
    if (!time) return "";
    const t = time?.trim().toLowerCase();
    if (t === "fixed") return "purchase-card-tag bg-fixed";
    if (t === "flexible") return "purchase-card-tag bg-flexible";
    return "purchase-card-tag";
  };

  const formatContentTag = (content) => {
    const c = content?.trim().toLowerCase();
    if (c === "live session") return "Live Sessions";
    if (c === "resource only") return "Resource Only";
    return content || "Resource Only";
  };

  const formatTimeTag = (time) => {
    if (!time) return null;
    return time.charAt(0).toUpperCase() + time.slice(1).toLowerCase();
  };

  return (
    <div className="purchase-card">
      <div className="purchase-card-header">
        <div>
          <p className="purchase-card-id">
            #{id} <span className={`status ${getStatusClass(status)}`}>{status}</span>
          </p>
          <p className="purchase-card-date">{date}</p>
        </div>

        <div className="purchase-card-price-view">
          <div className="purchase-card-price">
            <img src="/camera.png" alt="camera" />
            <p className="font-medium">{price ? `$${price}` : "-"}</p>
          </div>

          <button
            onClick={() => {}}
            className="purchase-card-view-button"
          >
            Download Invoice
            <img src="/export.png" alt="arrow" />
          </button>
        </div>
      </div>

      <div className="purchase-card-items">
        {items.map((item, index) => {
          if(width > 468){
            return (
              <div key={index} className="purchase-card-item">
                <div className="purchase-card-item-left">
                  <img src={item.image} alt={item.name} />
                  <div className="purchase-card-item-name-tags">
                    <p className="purchase-card-item-name">{item.name}</p>

                    {item.content && (
                      <span className={getContentTagClass(item.content)}>
                        {formatContentTag(item.content)}
                      </span>
                    )}

                    {item.time && (
                      <span className={getTimeTagClass(item.time)}>
                        {formatTimeTag(item.time)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="item-price">${item.price}</div>
              </div>
            )
          } else {
            return (
              <div key={index} className="purchase-card-item">
                {/* Left Section: Image */}
                <img src={item.image} alt={item.name} className="purchase-card-item-image" />

                {/* Center Section: Name and Tags */}
                <div className="purchase-card-item-center">
                  {/* Top Section: Name */}
                  <p className="purchase-card-item-name">{item.name}</p>
                  
                  {/* Bottom Section: Tags */}
                  <div className="purchase-card-item-tags">
                    {item.content && (
                      <span className={getContentTagClass(item.content)}>
                        {formatContentTag(item.content)}
                      </span>
                    )}

                    {item.time && (
                      <span className={getTimeTagClass(item.time)}>
                        {formatTimeTag(item.time)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Section: Price */}
                <div className="item-price">${item.price}</div>
              </div>
            )
          }
        })}
      </div>
    </div>
  );
};

export default PurchaseCard;
