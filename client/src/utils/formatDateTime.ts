export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (timeString: string) => {
  if (!timeString) return "";
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const calculateRecurringDates = (
  startDate: Date,
  endDate: Date,
  pattern: string
) => {
  if (pattern === "none" || !startDate || !endDate) {
    return [startDate];
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];

  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);

    switch (pattern) {
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "biweekly":
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case "monthly": {
        const month = currentDate.getMonth();
        currentDate.setMonth(month + 1);
        if (currentDate.getDate() !== start.getDate()) {
          currentDate.setDate(0);
        }
        break;
      }
      default:
        currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  return dates;
};
