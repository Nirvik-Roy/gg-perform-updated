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

    return new Date(date).toLocaleDateString("en-US", options);
};