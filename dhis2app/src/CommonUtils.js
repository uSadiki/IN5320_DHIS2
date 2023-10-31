//Util methods

//Get formated dates
export const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = `${today.getMonth() + 1}`.padStart(2, "0");
    return `${year}${month}`;
  };


  export const getDateAndTime = () => {
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();
    return formattedDateTime;
  };


// Calculate the number of days until the 14th of the next month
export const calculateDaysUntilNextMonth = () => {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(14);

  // Calculate the number of days until the 14th of the next month
  return Math.ceil((nextMonth - today) / (1000 * 60 * 60 * 24)) - 1;
};

