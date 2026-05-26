export const convertTo12Hour = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    const hour = Number(hours);
    const ampm = hour >= 12 ? "PM" : "AM";

    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
};

// utils/dateFormatter.js

export const formatDate = (
    date,
    options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }
) => {
    if (!date) return "";

    // If it's a date-only string (YYYY-MM-DD), parse manually to avoid timezone shift
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split("-").map(Number)
        const newDate = new Date(year, month - 1, day) // local time, no UTC shift
        return newDate.toLocaleDateString("en-US", options)
    }

    const newDate = new Date(date)
    return newDate.toLocaleDateString("en-US", { ...options, timeZone: "UTC" })
};