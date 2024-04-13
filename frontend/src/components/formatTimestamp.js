import React from 'react';

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours(); // Use let for hours to allow reassignment
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${period}`;
};

export { formatTimestamp };