export function getTimeframeFilter(timeframe) {
  const now = new Date();
  let startDate;
  let prevStartDate;

  switch (timeframe) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      prevStartDate = new Date(now.setDate(now.getDate() - 14));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      prevStartDate = new Date(now.setMonth(now.getMonth() - 2));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      prevStartDate = new Date(now.setMonth(now.getMonth() - 6));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      prevStartDate = new Date(now.setFullYear(now.getFullYear() - 2));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      prevStartDate = new Date(now.setMonth(now.getMonth() - 2));
  }

  return {
    startDate: startDate.toISOString(),
    prevStartDate: prevStartDate.toISOString(),
  };
}