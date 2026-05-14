// import { useContext, useEffect, useState } from "react";
// import '../css/calendar-time-selector.css';

// function CalendarTimeSelector({ selectedDate, selectedTime, onDateSelect, onTimeSelect }) {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [loading, setLoading] = useState(false);

//   const [workingDays, setWorkingDays] = useState([]); // fetched working days
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // time slots for selected date
  
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//   const [occupiedDates, setOccupiedDates] = useState([]);
//   const [occupiedSlots, setOccupiedSlots] = useState({});

//   // Helper function to check if a date has already passed
//   const isDatePassed = (dateString) => {
//     const today = new Date();
//     const selectedDate = new Date(dateString);
    
//     // Reset time to start of day for comparison
//     today.setHours(0, 0, 0, 0);
//     selectedDate.setHours(0, 0, 0, 0);
    
//     return selectedDate < today;
//   };

//   // Helper function to check if a time slot has already passed for today
//   const isTimeSlotPassed = (timeRange) => {
//     const now = new Date();
//     const today = formatDate(now);
    
//     // Only check if the selected date is today
//     if (selectedDate !== today) {
//       return false;
//     }
    
//     // Extract start time from range (e.g., "10:00 - 11:00" -> "10:00")
//     const startTime = timeRange.split(' - ')[0];
//     const [startHour, startMinute] = startTime.split(':').map(Number);
    
//     // Create a date object for the start time today
//     const slotStartTime = new Date();
//     slotStartTime.setHours(startHour, startMinute, 0, 0);
    
//     // Add 30 minutes buffer (slot is considered passed if it started more than 30 minutes ago)
//     const bufferTime = new Date(now.getTime() + 30 * 60 * 1000);
    
//     return slotStartTime < bufferTime;
//   };

//   const fetchWorkingHoursData = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/working-hours`, {
//         method: "GET",
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//       });
//       const data = await response.json();
//       console.log('Working Hours data:', data);
//       if (data.status === 'success') {
//         return data.data
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   }

//   const fetchOccupiedDates = async () =>{
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/occupied-slots`, {
//         method: "GET",
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       });
//       const data = await response.json();
//       console.log('Occupied dates data:', data);
//       if (data.status === 'success') {
//         return data.data.occupied_dates
//       }
//       return [];
//     } catch (error) {
//       console.error('Error fetching occupied dates:', error);
//     }
//   }

//   useEffect(() => {
//     if (selectedDate) {
//       const dateObj = new Date(selectedDate);
//       setCurrentDate(dateObj);
//     }
//   }, [selectedDate]);

//   // Fetch working hours on mount
//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       const [data, occupiedData] = await Promise.all([fetchWorkingHoursData(), fetchOccupiedDates()]);
//       setWorkingDays(data);
      
//       // Process occupied data
//       const occupiedDatesList = [];
//       const occupiedSlotsMap = {};
      
//       occupiedData.forEach(item => {
//         // Check if entire day is blocked (00:00 to 23:59)
//         const isFullDayBlocked = item.slots.some(slot => 
//           (slot.start_time === "00:00:00" && slot.end_time === "23:59:00") ||
//           (slot.start_time === "00:00" && slot.end_time === "23:59")
//         );
        
//         if (isFullDayBlocked) {
//           occupiedDatesList.push(item.date);
//           occupiedSlotsMap[item.date] = 'FULL_DAY';
//         } else {
//           // Convert slots to our format (HH:MM - HH:MM)
//           const formattedSlots = item.slots.map(slot => {
//             const startTime = slot.start_time.substring(0, 5); // "10:00:00" -> "10:00"
//             const endTime = slot.end_time.substring(0, 5);     // "11:00:00" -> "11:00"
//             return `${startTime} - ${endTime}`;
//           });
//           occupiedSlotsMap[item.date] = formattedSlots;
//         }
//       });
      
//       setOccupiedDates(occupiedDatesList);
//       setOccupiedSlots(occupiedSlotsMap);
//       setLoading(false);
//     }
//     fetchData();
//   }, []);

//   const getWorkingDayConfig = (date) => {
//     // JS: Sunday=0, Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6
//     // Backend: Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6, Sunday=7
//     const jsDay = date.getDay();

//     // Create explicit mapping
//     const dayMapping = {
//       0: 7, // Sunday -> id 7
//       1: 1, // Monday -> id 1  
//       2: 2, // Tuesday -> id 2
//       3: 3, // Wednesday -> id 3
//       4: 4, // Thursday -> id 4
//       5: 5, // Friday -> id 5
//       6: 6  // Saturday -> id 6
//     };

//     const backendId = dayMapping[jsDay];
//     return workingDays.find(d => d.id === backendId);
//   };

//   const generateTimeSlots = (start, end) => {
//     const slots = [];
//     let [sh, sm] = start.split(":").map(Number);
//     let [eh, em] = end.split(":").map(Number);

//     let current = new Date(0, 0, 0, sh, sm);
//     const endTime = new Date(0, 0, 0, eh, em);

//     const pad = n => n.toString().padStart(2, '0');

//     while (current < endTime) {
//       let next = new Date(current.getTime() + 60 * 60 * 1000); // Add 1 hour

//       // If next slot would exceed end time, adjust it to end time for the final slot
//       if (next > endTime) {
//         next = new Date(endTime.getTime());
//       }

//       // Only add slot if there's a meaningful time difference (at least 1 minute)
//       if (next.getTime() - current.getTime() >= 60 * 1000) {
//         slots.push(`${pad(current.getHours())}:${pad(current.getMinutes())} - ${pad(next.getHours())}:${pad(next.getMinutes())}`);
//       }

//       // If we've reached the end time, break
//       if (next.getTime() >= endTime.getTime()) {
//         break;
//       }

//       current = next;
//     }

//     return slots;
//   };

//   useEffect(() => {
//     if (!selectedDate || !workingDays.length) {
//       setAvailableTimeSlots([]);
//       return;
//     }

//     const [year, month, day] = selectedDate.split('-').map(Number);
//     const dateObj = new Date(year, month - 1, day);
//     const config = getWorkingDayConfig(dateObj);

//     // DEBUG: Log what we're getting
//     console.log('Selected Date:', selectedDate);
//     console.log('Date Object Day:', dateObj.getDay()); // 0=Sun, 1=Mon, etc.
//     console.log('Config found:', config);

//     if (!config || !config.is_active) {
//       console.log('No config or inactive day');
//       setAvailableTimeSlots([]);
//       return;
//     }

//     console.log('Start time:', config.start_time);
//     console.log('End time:', config.end_time);

//     // Fix: Remove seconds from time format
//     const startTime = config.start_time.substring(0, 5); // "09:30:00" -> "09:30"
//     const endTime = config.end_time.substring(0, 5);     // "17:00:00" -> "17:00"

//     const slots = generateTimeSlots(startTime, endTime);
//     console.log('Generated slots:', slots);

//     // Check if date is fully occupied
//     const dateOccupiedSlots = occupiedSlots[selectedDate];
//     if (dateOccupiedSlots === 'FULL_DAY') {
//       console.log('Date is fully occupied');
//       setAvailableTimeSlots([]);
//       return;
//     }

//     // Remove occupied times
//     const occupied = dateOccupiedSlots || [];
//     let finalSlots = slots.filter(slot => !occupied.includes(slot));

//     // Check if all slots are occupied (date is fully booked)
//     if (finalSlots.length === 0 && slots.length > 0) {
//       console.log('All slots are occupied for this date');
//       // Update the occupied slots map to mark this date as fully occupied
//       setOccupiedSlots(prev => ({
//         ...prev,
//         [selectedDate]: 'FULL_DAY'
//       }));
//       // Add to occupied dates list if not already there
//       setOccupiedDates(prev => {
//         if (!prev.includes(selectedDate)) {
//           return [...prev, selectedDate];
//         }
//         return prev;
//       });
//     }

//     console.log('Final slots after removing occupied:', finalSlots);
    
//     // Filter out expired time slots for today
//     const currentTimeSlots = finalSlots.filter(slot => !isTimeSlotPassed(slot));
    
//     console.log('Final slots after removing expired:', currentTimeSlots);
//     setAvailableTimeSlots(currentTimeSlots);
//   }, [selectedDate, workingDays, occupiedSlots]);

//   const getDaysInMonth = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const daysInMonth = lastDay.getDate();
//     const startDay = firstDay.getDay();

//     const days = [];

//     // Days from previous month
//     if (startDay > 0) {
//       const prevMonth = month === 0 ? 11 : month - 1;
//       const prevYear = month === 0 ? year - 1 : year;
//       const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
//       for (let i = startDay - 1; i >= 0; i--) {
//         const day = prevMonthLastDay - i;
//         days.push({
//           day,
//           isCurrentMonth: false,
//           date: new Date(prevYear, prevMonth, day)
//         });
//       }
//     }

//     // Days of current month
//     for (let day = 1; day <= daysInMonth; day++) {
//       days.push({
//         day,
//         isCurrentMonth: true,
//         date: new Date(year, month, day)
//       });
//     }

//     // Days from next month
//     const totalCells = days.length;
//     const remainingCells = 42 - totalCells;
//     if (remainingCells > 0) {
//       const nextMonth = month === 11 ? 0 : month + 1;
//       const nextYear = month === 11 ? year + 1 : year;
//       for (let day = 1; day <= remainingCells; day++) {
//         days.push({
//           day,
//           isCurrentMonth: false,
//           date: new Date(nextYear, nextMonth, day)
//         });
//       }
//     }

//     return days;
//   };

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const handleDateSelect = (dateObj) => {
//     const formattedDate = formatDate(dateObj);
//     onDateSelect(formattedDate);
//     setCurrentDate(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1)); // Ensure calendar view syncs with selected date
//   };

//   const handleTimeSelect = (timeRange) => {
//     onTimeSelect(timeRange);
//   };

//   const handlePrevMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
//   };

//   const handleNextMonth = () => {
//     setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
//   };

//   const days = getDaysInMonth(currentDate);
//   const today = new Date();

//   if (loading) {
//     return (
//       <div className="calendar-time-selector-loading">
//         <div className="loading-spinner"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="calendar-time-selector">
//       <div className="calendar-time-selector-date-section">
//         <h3 className="calendar-time-selector-title">Select Date</h3>

//         {/* Month Navigation */}
//         <div className="calendar-time-selector-calendar-header">
//           <button
//             className="calendar-time-selector-nav-button"
//             onClick={handlePrevMonth}
//           >
//             ‹
//           </button>
//           <span className="calendar-time-selector-month-year">
//             {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
//           </span>
//           <button
//             className="calendar-time-selector-nav-button"
//             onClick={handleNextMonth}
//           >
//             ›
//           </button>
//         </div>

//         {/* Calendar Container */}
//         <div className="calendar-time-selector-calendar">
//           {/* Day Headers */}
//           <div className="calendar-time-selector-weekdays">
//             {dayNames.map((day) => (
//               <div key={day} className="calendar-time-selector-weekday">
//                 {day}
//               </div>
//             ))}
//           </div>

//           {/* Calendar Days */}
//           <div className="calendar-time-selector-days-grid">
//             {days.map((dayObj, index) => {
//               const formatted = formatDate(dayObj.date);
//               const isSelected = selectedDate === formatted;
//               const isToday = formatDate(dayObj.date) === formatDate(today);
//               const config = getWorkingDayConfig(dayObj.date);
//               const isWorking = config && config.is_active;
//               const isOccupied = occupiedDates.includes(formatted);
//               const isFullyOccupied = occupiedSlots[formatted] === 'FULL_DAY';
//               const isExpired = isDatePassed(formatted);

//               // Generate tooltip text based on why the date is blocked
//               let tooltipText = '';
//               if (!dayObj.isCurrentMonth) {
//                 tooltipText = 'Not available this month';
//               } else if (isExpired) {
//                 tooltipText = 'Date has already passed';
//               } else if (!isWorking) {
//                  tooltipText = 'Non-working day';
//               } else if (isFullyOccupied) {
//                 tooltipText = 'Fully booked';
//               }

//               let dayClass = 'calendar-time-selector-day';
//               if (!dayObj.isCurrentMonth) dayClass += ' calendar-time-selector-day-other-month';
//               if (isSelected) dayClass += ' calendar-time-selector-day-selected';
//               if (isToday && !isSelected) dayClass += ' calendar-time-selector-day-today';
//               if (!isWorking || isExpired) dayClass += ' calendar-time-selector-day-nonworking';
//               if (isOccupied) dayClass += ' calendar-time-selector-day-occupied';

//               let style = {};
//               // Only mark green if current month, working, not fully occupied, not selected, not expired
//               if (dayObj.isCurrentMonth && isWorking && !isFullyOccupied && !isSelected && !isExpired) {
//                 style = { color: 'green' };
//               }
//               if (!isWorking || isExpired) {
//                 style = { color: '#6D6D6D', cursor: 'not-allowed' };
//               }
//               if (isFullyOccupied) {
//                 style = { color: 'red', cursor: 'not-allowed' };
//               }

//               return (
//                 <div
//                   key={index}
//                   className={dayClass}
//                   style={style}
//                   title={tooltipText}
//                   onClick={() => {
//                     if (!dayObj.isCurrentMonth || !isWorking || isFullyOccupied || isExpired) return;
//                     handleDateSelect(dayObj.date);
//                   }}
//                 >
//                   {dayObj.day}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Time Selection */}
//       <div className="calendar-time-selector-time-section">
//         <h3 className="calendar-time-selector-title">Select Time</h3>

//         <div className="calendar-time-selector-time-grid">
//           {availableTimeSlots.length === 0 && <div style={{ color: '#6D6D6D', gridColumn: '1/-1', textAlign: 'center' }}>No available slots</div>}
//           {availableTimeSlots.map((timeRange, index) => {
//             const isExpired = isTimeSlotPassed(timeRange);
//             return (
//               <div
//                 key={index}
//                 className={`calendar-time-selector-time-slot ${selectedTime === timeRange ? 'calendar-time-selector-time-selected' : ''} ${isExpired ? 'calendar-time-selector-time-expired' : ''}`}
//                 style={isExpired ? { color: '#6D6D6D', cursor: 'not-allowed', opacity: 0.6 } : {}}
//                 title={isExpired ? 'This time slot has already passed' : ''}
//                 onClick={() => {
//                   if (!isExpired) {
//                     handleTimeSelect(timeRange);
//                   }
//                 }}
//               >
//                 {timeRange}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CalendarTimeSelector; 
import { useContext, useEffect, useState } from "react";
import '../css/calendar-time-selector.css';
// import CommonLoader from "./common-loader";

function CalendarTimeSelector({ selectedDate, selectedTime, onDateSelect, onTimeSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const [workingDays, setWorkingDays] = useState([]); // fetched working days
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // time slots for selected date

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [occupiedDates, setOccupiedDates] = useState([]);
  const [occupiedSlots, setOccupiedSlots] = useState({});

  // Helper function to check if a date has already passed
  const isDatePassed = (dateString) => {
    const today = new Date();
    const selectedDate = new Date(dateString);

    // Reset time to start of day for comparison
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate < today;
  };

  // Helper function to check if a time slot has already passed for today
  const isTimeSlotPassed = (timeRange) => {
    const now = new Date();
    const today = formatDate(now);

    // Only check if the selected date is today
    if (selectedDate !== today) {
      return false;
    }

    // Extract start time from range (e.g., "10:00 - 11:00" -> "10:00")
    const startTime = timeRange.split(' - ')[0];
    const [startHour, startMinute] = startTime.split(':').map(Number);

    // Create a date object for the start time today
    const slotStartTime = new Date();
    slotStartTime.setHours(startHour, startMinute, 0, 0);

    // Add 30 minutes buffer (slot is considered passed if it started more than 30 minutes ago)
    const bufferTime = new Date(now.getTime() + 30 * 60 * 1000);

    return slotStartTime < bufferTime;
  };

  // Helper function to check if a time slot overlaps with any occupied time range
  const isTimeSlotOccupied = (slotTimeRange, occupiedRanges) => {
    if (!occupiedRanges || occupiedRanges.length === 0) {
      return false;
    }

    try {
      // Parse the slot time range (e.g., "12:00 - 13:00")
      const [slotStart, slotEnd] = slotTimeRange.split(' - ');
      if (!slotStart || !slotEnd) {
        console.warn('Invalid slot time range format:', slotTimeRange);
        return false;
      }

      const [slotStartHour, slotStartMinute] = slotStart.split(':').map(Number);
      const [slotEndHour, slotEndMinute] = slotEnd.split(':').map(Number);

      // Validate parsed values
      if (isNaN(slotStartHour) || isNaN(slotStartMinute) || isNaN(slotEndHour) || isNaN(slotEndMinute)) {
        console.warn('Invalid time values in slot:', slotTimeRange);
        return false;
      }

      // Convert to minutes for easier comparison
      const slotStartMinutes = slotStartHour * 60 + slotStartMinute;
      const slotEndMinutes = slotEndHour * 60 + slotEndMinute;

      // Check if this slot overlaps with any occupied range
      return occupiedRanges.some(occupiedRange => {
        try {
          // Parse the occupied time range (e.g., "12:00 - 14:00")
          const [occupiedStart, occupiedEnd] = occupiedRange.split(' - ');
          if (!occupiedStart || !occupiedEnd) {
            console.warn('Invalid occupied time range format:', occupiedRange);
            return false;
          }

          const [occupiedStartHour, occupiedStartMinute] = occupiedStart.split(':').map(Number);
          const [occupiedEndHour, occupiedEndMinute] = occupiedEnd.split(':').map(Number);

          // Validate parsed values
          if (isNaN(occupiedStartHour) || isNaN(occupiedStartMinute) || isNaN(occupiedEndHour) || isNaN(occupiedEndMinute)) {
            console.warn('Invalid time values in occupied range:', occupiedRange);
            return false;
          }

          // Convert to minutes for easier comparison
          const occupiedStartMinutes = occupiedStartHour * 60 + occupiedStartMinute;
          const occupiedEndMinutes = occupiedEndHour * 60 + occupiedEndMinute;

          // Check for overlap: two time ranges overlap if one starts before the other ends
          // and the other starts before the first one ends
          return (slotStartMinutes < occupiedEndMinutes && slotEndMinutes > occupiedStartMinutes);
        } catch (error) {
          console.warn('Error parsing occupied range:', occupiedRange, error);
          return false;
        }
      });
    } catch (error) {
      console.warn('Error parsing slot time range:', slotTimeRange, error);
      return false;
    }
  };


  const fetchWorkingHoursData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/working-hours`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg admin token'))}`,
          'Accept': 'application/json'
        },
      });
      const data = await response.json();
      console.log('Working Hours data:', data);
      if (data.status === 'success') {
        return data.data
      }
      return [];
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchOccupiedDates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}frontend/occupied-slots`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg admin token'))}`,
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Occupied dates data:', data);
      if (data.status === 'success') {
        return data.data.occupied_dates
      }
      return [];
    } catch (error) {
      console.error('Error fetching occupied dates:', error);
    }
  }

  useEffect(() => {
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      setCurrentDate(dateObj);
    }
  }, [selectedDate]);

  // Fetch working hours on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [data, occupiedData] = await Promise.all([fetchWorkingHoursData(), fetchOccupiedDates()]);
      setWorkingDays(data);

      // Process occupied data
      const occupiedDatesList = [];
      const occupiedSlotsMap = {};

      occupiedData.forEach(item => {
        // Extract date from the item (handle both "2025-09-25" and "2025-09-25 00:00:00" formats)
        const dateOnly = item.date.split(' ')[0]; // Get just the date part
        
        // Check if entire day is blocked using the new data structure
        const isFullDayBlocked = item.slots.some(slot => {
          // Check for is_full_day flag first
          if (slot.details && slot.details.is_full_day === 1) {
            return true;
          }
          // Fallback to time-based detection
          return (slot.start_time === "00:00:00" && slot.end_time === "23:59:00") ||
                 (slot.start_time === "00:00" && slot.end_time === "23:59");
        });

        if (isFullDayBlocked) {
          occupiedDatesList.push(dateOnly);
          occupiedSlotsMap[dateOnly] = 'FULL_DAY';
        } else {
          // Convert slots to our format (HH:MM - HH:MM)
          const formattedSlots = item.slots.map(slot => {
            // Handle both "10:00:00" and "00:00" formats
            const startTime = slot.start_time.length > 5 ? 
              slot.start_time.substring(0, 5) : // "10:00:00" -> "10:00"
              slot.start_time.padEnd(5, ':00'); // "00:00" -> "00:00"
            
            const endTime = slot.end_time.length > 5 ? 
              slot.end_time.substring(0, 5) :   // "11:00:00" -> "11:00"
              slot.end_time.padEnd(5, ':00');   // "23:59" -> "23:59"
            
            return `${startTime} - ${endTime}`;
          });
          
          // Only add to map if there are actual slots
          if (formattedSlots.length > 0) {
            occupiedSlotsMap[dateOnly] = formattedSlots;
          }
        }
      });

      setOccupiedDates(occupiedDatesList);
      setOccupiedSlots(occupiedSlotsMap);
      setLoading(false);
    }
    fetchData();
  }, []);

  const getWorkingDayConfig = (date) => {
    // JS: Sunday=0, Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6
    // Backend: Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5, Saturday=6, Sunday=7
    const jsDay = date.getDay();

    // Create explicit mapping
    const dayMapping = {
      0: 7, // Sunday -> id 7
      1: 1, // Monday -> id 1  
      2: 2, // Tuesday -> id 2
      3: 3, // Wednesday -> id 3
      4: 4, // Thursday -> id 4
      5: 5, // Friday -> id 5
      6: 6  // Saturday -> id 6
    };

    const backendId = dayMapping[jsDay];
    return workingDays.find(d => d.id === backendId);
  };

  const generateTimeSlots = (start, end) => {
    const slots = [];
    let [sh, sm] = start.split(":").map(Number);
    let [eh, em] = end.split(":").map(Number);

    let current = new Date(0, 0, 0, sh, sm);
    const endTime = new Date(0, 0, 0, eh, em);

    const pad = n => n.toString().padStart(2, '0');

    while (current < endTime) {
      let next = new Date(current.getTime() + 60 * 60 * 1000); // Add 1 hour

      // If next slot would exceed end time, adjust it to end time for the final slot
      if (next > endTime) {
        next = new Date(endTime.getTime());
      }

      // Only add slot if there's a meaningful time difference (at least 1 minute)
      if (next.getTime() - current.getTime() >= 60 * 1000) {
        slots.push(`${pad(current.getHours())}:${pad(current.getMinutes())} - ${pad(next.getHours())}:${pad(next.getMinutes())}`);
      }

      // If we've reached the end time, break
      if (next.getTime() >= endTime.getTime()) {
        break;
      }

      current = next;
    }

    return slots;
  };

  useEffect(() => {
    if (!selectedDate || !workingDays.length) {
      setAvailableTimeSlots([]);
      return;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const config = getWorkingDayConfig(dateObj);

    // DEBUG: Log what we're getting
    console.log('Selected Date:', selectedDate);
    console.log('Date Object Day:', dateObj.getDay()); // 0=Sun, 1=Mon, etc.
    console.log('Config found:', config);

    if (!config || !config.is_active) {
      console.log('No config or inactive day');
      setAvailableTimeSlots([]);
      return;
    }

    console.log('Start time:', config.start_time);
    console.log('End time:', config.end_time);

    // Fix: Remove seconds from time format
    const startTime = config.start_time.substring(0, 5); // "09:30:00" -> "09:30"
    const endTime = config.end_time.substring(0, 5);     // "17:00:00" -> "17:00"

    const slots = generateTimeSlots(startTime, endTime);
    console.log('Generated slots:', slots);

    // Check if date is fully occupied
    const dateOccupiedSlots = occupiedSlots[selectedDate];
    if (dateOccupiedSlots === 'FULL_DAY') {
      console.log('Date is fully occupied');
      setAvailableTimeSlots([]);
      return;
    }

    // Remove occupied times using overlap detection
    const occupied = dateOccupiedSlots || [];
    let finalSlots = slots.filter(slot => !isTimeSlotOccupied(slot, occupied));

    // Check if all slots are occupied (date is fully booked)
    if (finalSlots.length === 0 && slots.length > 0) {
      console.log('All slots are occupied for this date');
      // Update the occupied slots map to mark this date as fully occupied
      setOccupiedSlots(prev => ({
        ...prev,
        [selectedDate]: 'FULL_DAY'
      }));
      // Add to occupied dates list if not already there
      setOccupiedDates(prev => {
        if (!prev.includes(selectedDate)) {
          return [...prev, selectedDate];
        }
        return prev;
      });
    }

    console.log('Final slots after removing occupied:', finalSlots);
    setAvailableTimeSlots(finalSlots);

    // Filter out expired time slots for today
    const currentTimeSlots = finalSlots.filter(slot => !isTimeSlotPassed(slot));

    console.log('Final slots after removing expired:', currentTimeSlots);
    setAvailableTimeSlots(currentTimeSlots);
  }, [selectedDate, workingDays, occupiedSlots]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];

    // Days from previous month
    if (startDay > 0) {
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
      for (let i = startDay - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        days.push({
          day,
          isCurrentMonth: false,
          date: new Date(prevYear, prevMonth, day)
        });
      }
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day)
      });
    }

    // Days from next month
    const totalCells = days.length;
    const remainingCells = 42 - totalCells;
    if (remainingCells > 0) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      for (let day = 1; day <= remainingCells; day++) {
        days.push({
          day,
          isCurrentMonth: false,
          date: new Date(nextYear, nextMonth, day)
        });
      }
    }

    return days;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (dateObj) => {
    const formattedDate = formatDate(dateObj);
    onDateSelect(formattedDate);
    setCurrentDate(new Date(dateObj.getFullYear(), dateObj.getMonth(), 1)); // Ensure calendar view syncs with selected date
  };

  const handleTimeSelect = (timeRange) => {
    onTimeSelect(timeRange);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  if (loading) {
    return (
      <div className="calendar-time-selector-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="calendar-time-selector">
      <div className="calendar-time-selector-date-section">
        <h3 className="calendar-time-selector-title">Select Date</h3>

        {/* Month Navigation */}
        <div className="calendar-time-selector-calendar-header">
          <button
            className="calendar-time-selector-nav-button"
            onClick={handlePrevMonth}
          >
            ‹
          </button>
          <span className="calendar-time-selector-month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            className="calendar-time-selector-nav-button"
            onClick={handleNextMonth}
          >
            ›
          </button>
        </div>

        {/* Calendar Container */}
        <div className="calendar-time-selector-calendar">
          {/* Day Headers */}
          <div className="calendar-time-selector-weekdays">
            {dayNames.map((day) => (
              <div key={day} className="calendar-time-selector-weekday">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="calendar-time-selector-days-grid">
            {days.map((dayObj, index) => {
              const formatted = formatDate(dayObj.date);
              const isSelected = selectedDate === formatted;
              const isToday = formatDate(dayObj.date) === formatDate(today);
              const config = getWorkingDayConfig(dayObj.date);
              const isWorking = config && config.is_active;
              const isOccupied = occupiedDates.includes(formatted);
              const isFullyOccupied = occupiedSlots[formatted] === 'FULL_DAY';
              const isExpired = isDatePassed(formatted);

              // Generate tooltip text based on why the date is blocked
              let tooltipText = '';
              if (!dayObj.isCurrentMonth) {
                tooltipText = 'Not available this month';
              } else if (!isWorking) {
                tooltipText = 'Non-working day';
              } else if (isFullyOccupied) {
                tooltipText = 'Fully booked';
              } else if (isExpired) {
                tooltipText = 'Date has already passed';
              }

              let dayClass = 'calendar-time-selector-day';
              if (!dayObj.isCurrentMonth) dayClass += ' calendar-time-selector-day-other-month';
              if (isSelected) dayClass += ' calendar-time-selector-day-selected';
              if (isToday && !isSelected) dayClass += ' calendar-time-selector-day-today';
              if (!isWorking) dayClass += ' calendar-time-selector-day-nonworking';
              if (!isWorking || isExpired) dayClass += ' calendar-time-selector-day-nonworking';
              if (isOccupied) dayClass += ' calendar-time-selector-day-occupied';

              let style = {};
              // Only mark green if current month, working, not fully occupied, not selected, not expired
              if (dayObj.isCurrentMonth && isWorking && !isFullyOccupied && !isSelected && !isExpired) {
                style = { color: 'green' };
              }
              if (!isWorking || isExpired) {
                style = { color: '#6D6D6D', cursor: 'not-allowed' };
              }
              if (isFullyOccupied) {
                style = { color: 'red', cursor: 'not-allowed' };
              }

              return (
                <div
                  key={index}
                  className={dayClass}
                  style={style}
                  title={tooltipText}
                  onClick={() => {
                    if (!dayObj.isCurrentMonth || !isWorking || isFullyOccupied || isExpired) return;
                    handleDateSelect(dayObj.date);
                  }}
                >
                  {dayObj.day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Selection */}
      <div className="calendar-time-selector-time-section">
        <h3 className="calendar-time-selector-title">Select Time</h3>

        <div className="calendar-time-selector-time-grid">
          {availableTimeSlots.length === 0 && <div style={{ color: '#6D6D6D', gridColumn: '1/-1', textAlign: 'center' }}>No available slots</div>}
          {availableTimeSlots.map((timeRange, index) => {
            const isExpired = isTimeSlotPassed(timeRange);
            return (
              <div
                key={index}
                className={`calendar-time-selector-time-slot ${selectedTime === timeRange ? 'calendar-time-selector-time-selected' : ''} ${isExpired ? 'calendar-time-selector-time-expired' : ''}`}
                style={isExpired ? { color: '#6D6D6D', cursor: 'not-allowed', opacity: 0.6 } : {}}
                title={isExpired ? 'This time slot has already passed' : ''}
                onClick={() => {
                  if (!isExpired) {
                    handleTimeSelect(timeRange);
                  }
                }}
              >
                {timeRange}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarTimeSelector; 