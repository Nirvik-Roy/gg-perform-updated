import { React, useState, useEffect } from 'react';
import PurchaseCard from '../../../component/PurchaseCard';
import { useBanner } from '../../../context/BannerContext';
import './Purchasehistory.css';

const statusOptions = ["All", "Completed", "Not Complete"];

const Purchasehistory = () => {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [allCourses, setAllCourses] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [processedPurchaseData, setProcessedPurchaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPurchaseHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      console.log("data from purchase history", data);
      if (data.status === "success") {
        return data.data
      }
      else {
        console.log("error from purchase history", data.message);
        return []
      }
    } catch (error) {
      console.log("error from purchase history", error);
      return []
    }
  }

  const fetchAllCourses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/courses`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      console.log("data from fetchAllCourses", data);
      if (data.status === "success") {
        return data.data
      }
      else {
        console.log("error from fetchAllCourses", data.message);
        return []
      }
    } catch (error) {
      console.log("error from fetchAllCourses", error);
      return []
    }
  }

  // Process and map the API data to the expected format
  const processPurchaseData = (purchaseData, coursesData) => {
    return purchaseData.map(order => {
      // Map order items to include course details
      const processedItems = order.items.map(item => {
        const course = coursesData.find(course => course.id === item.course_id);
        return {
          courseId: item.course_id,
          name: course ? course.course_name : 'Unknown Course',
          content: course ? course.course_type : 'Resource Only',
          time: course ? course.live_session_type : null,
          price: item.price,
          image: course ? course.featured_image : '/course.png',
        };
      });

      // Calculate total price
      const totalPrice = order.items.reduce((sum, item) => sum + item.price, 0);

      // Format date
      const orderDate = new Date(order.created_at);
      const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Determine status based on order status
      const displayStatus = order.status === 'paid' ? 'Completed' : 'Not Complete';

      return {
        id: order.id.toString(),
        status: displayStatus,
        date: formattedDate,
        price: totalPrice,
        items: processedItems,
        originalOrderData: order // Keep original data for reference
      };
    });
  };

  useEffect(() => {
    setBannerTitle("My Account");
    setBreadcrumb("My Account");
    setBannerImage("/other-banner.png");

    const fetching = async () => {
      setIsLoading(true);
      try {
        const [purchaseData, coursesData] = await Promise.all([
          fetchPurchaseHistory(), 
          fetchAllCourses()
        ]);

        setAllCourses(coursesData);
        setPurchaseHistory(purchaseData);
        
        // Process the data
        const processedData = processPurchaseData(purchaseData, coursesData);
        setProcessedPurchaseData(processedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetching();
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);

  const filteredPurchaseData =
    selectedStatus === "All"
      ? processedPurchaseData
      : processedPurchaseData.filter((purchase) => purchase.status === selectedStatus);

  // Loading state
  if (isLoading) {
    return (
      <div className="purchase-history-container">
        <h2 className="purchase-history-title">Purchase History</h2>
        
        {/* Status Tabs */}
        <div className="status-tabs">
          {statusOptions.map((status) => (
            <button
              key={status}
              disabled
              className="status-button status-button-inactive"
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loading State */}
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading purchase history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="purchase-history-container">
      <h2 className="purchase-history-title">Purchase History</h2>

      {/* Status Tabs */}
      <div className="status-tabs">
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`status-button ${selectedStatus === status
              ? "status-button-active"
              : "status-button-inactive"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Order Cards */}
      {filteredPurchaseData.length ? (
        filteredPurchaseData.map((purchase) => (
          <PurchaseCard key={purchase.id} purchaseData={purchase} />
        ))
      ) : (
        <p className="no-orders">No orders found.</p>
      )}
    </div>
  );
};

export default Purchasehistory;