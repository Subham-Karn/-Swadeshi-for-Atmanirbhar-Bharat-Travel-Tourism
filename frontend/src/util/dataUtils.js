
export const processDataList = (data = [], dateKey = 'createdAt', newHours = 24) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const THRESHOLD = newHours * 60 * 60 * 1000;
  const now = new Date();

  return [...data]
    .sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]))
    .map((item) => {
      const createdDate = new Date(item[dateKey]);
      const isRecent = (now - createdDate) < THRESHOLD;

      return {
        ...item,
        isNew: isRecent,
      };
    });
};