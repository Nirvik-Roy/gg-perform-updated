import React, { useEffect, useState } from 'react';
import AppointmentCard from '../../../component/AppointmentCard';
import { useBanner } from '../../../context/BannerContext';
import "./Appointments.css";

const Appointments = () => {
  const { setBannerTitle, setBreadcrumb, setBannerImage } = useBanner();
  const [selectedTab, setSelectedTab] = useState('all');
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setBannerTitle("My Account");
    setBreadcrumb("My Account");
    setBannerImage("/other-banner.png");
  }, [setBannerTitle, setBreadcrumb, setBannerImage]);

  const statusTabs = [
    { label: 'All', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    return `${day} ${dayOfMonth}`;
  };

  // Helper function to format time
  const formatTime = (startTime, endTime) => {
    const formatTime12Hour = (timeString) => {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    const start = formatTime12Hour(startTime);
    const end = formatTime12Hour(endTime);
    return `${start}–${end}`;
  };

  // Helper function to determine status
  const determineStatus = (date, startTime) => {
    const appointmentDateTime = new Date(`${date} ${startTime}`);
    const now = new Date();
    
    if (appointmentDateTime < now) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/appointments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg website token'))}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Raw API data:', data);
      
      if (data.status === 'success' && data.data) {
        // Transform the API data to match the expected format
        const transformedData = data.data.map((appointment) => {
          const status = determineStatus(appointment.date, appointment.start_time);
          
          return {
            id: appointment.id,
            date: formatDate(appointment.date),
            time: formatTime(appointment.start_time, appointment.end_time),
            status: status,
            canCancel: status === 'upcoming', // Can only cancel upcoming appointments
            canReschedule: status === 'upcoming', // Can only reschedule upcoming appointments
            // Additional data from API that might be useful
            originalData: appointment,
            service: appointment.service,
            user: appointment.user,
            total: appointment.total,
            final_total: appointment.final_total,
            coupon_discount: appointment.coupon_discount,
          };
        });
        
        console.log('Transformed data:', transformedData);
        return transformedData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await fetchAppointments();
      setAppointmentsData(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filteredAppointments =
    selectedTab === 'all'
      ? appointmentsData
      : appointmentsData.filter((appt) => appt.status === selectedTab);

  if (isLoading) {
    return (
      <div className="appointments-outer-container">
        <h2 className="appointments-title">Appointments</h2>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Loading appointments...
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-outer-container">
      <h2 className="appointments-title">Appointments</h2>
      {/* Status Tabs - outside the main card container */}
      <div className="appointments-status-tabs">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            className={`tab-btn${selectedTab === tab.value ? ' active' : ''}`}
            onClick={() => setSelectedTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Main bordered container for appointment cards */}
      <div className="appointments-page">
        <div className="appointments-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <AppointmentCard key={appt.id} {...appt} />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              No appointments found for this filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;
