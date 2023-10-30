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

