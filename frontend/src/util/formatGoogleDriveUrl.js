export const formatGoogleDriveUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  // Regex to extract the File ID
  const regex = /\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);

  if (match) {
    const fileId = match[1] || match[2];

    // OPTION A: The UC link (standard)
    // return `https://drive.google.com/uc?export=view&id=${fileId}`;

    // OPTION B: The Thumbnail link (Best for previews, bypasses virus scan warnings)
    // =s1000 tells Google to give you a 1000px version
    return `https://lh3.googleusercontent.com/u/0/d/${fileId}=s1000`;
  }

  return url;
};