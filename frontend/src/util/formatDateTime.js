export const formatDateTime = (dateInput) => {
  if (!dateInput) return "";

  const date = new Date(dateInput);
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  // 1. Format the Absolute Date (24/12/2005)
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const fullDate = `${day}/${month}/${year}`;

  // 2. Calculate the Relative Time
  let relativeTime = "";

  if (secondsPast < 60) {
    relativeTime = "just now";
  } else if (secondsPast < 3600) {
    const mins = Math.floor(secondsPast / 60);
    relativeTime = `${mins} min ago`;
  } else if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    relativeTime = `${hours}h ago`;
  } else if (secondsPast < 2592000) {
    const days = Math.floor(secondsPast / 86400);
    relativeTime = days === 1 ? "yesterday" : `${days} days ago`;
  } else if (secondsPast < 31536000) {
    const months = Math.floor(secondsPast / 2592000);
    relativeTime = months === 1 ? "1 month ago" : `${months} months ago`;
  } else {
    const years = Math.floor(secondsPast / 31536000);
    relativeTime = years === 1 ? "1 year ago" : `${years} years ago`;
  }

  return `${relativeTime}  ${fullDate}`;
};