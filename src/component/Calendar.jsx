import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";
import "../css/calendar.css";

export default function Calendar({ selected, onSelect }) {
  const [current, setCurrent] = useState(selected || new Date());

  const Header = () => (
    <div className="cal-header">
      <button onClick={() => setCurrent(subMonths(current, 1))}>&#8249;</button>
      <span className="cal-month">{format(current, "MMMM yyyy")}</span>
      <button onClick={() => setCurrent(addMonths(current, 1))}>&#8250;</button>
    </div>
  );

  const WeekDays = () => {
    const start = startOfWeek(current);
    return (
      <div className="cal-week-row">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="cal-weekday">
            {format(addDays(start, i), "EEE")}
          </div>
        ))}
      </div>
    );
  };

  const Cells = () => {
    const monthStart = startOfMonth(current);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = day;
        days.push(
          <div
            key={d}
            className={`cal-cell
              ${!isSameMonth(d, monthStart) ? "disabled" : ""}
              ${isSameDay(d, selected) ? "selected" : ""}`}
            onClick={() => isSameMonth(d, monthStart) && onSelect(d)}
          >
            {format(d, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="cal-row">
          {days}
        </div>
      );
    }
    return rows;
  };

  return (
    <section className="calendar">
      <Header />
      <WeekDays />
      <Cells />
    </section>
  );
}
