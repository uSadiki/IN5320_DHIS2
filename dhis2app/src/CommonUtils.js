import { useDataQuery } from '@dhis2/app-runtime';

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

// Define the usernameQuery outside the component
const usernameQuery = {
  user: {
    resource: "users",
    params: {
      fields: 'displayName',
      filter: 'userCredentials.username:eq:admin',
    },
  },
};

export function getUserName() {
  const { data } = useDataQuery(usernameQuery);
  let username;
  if (data) {
    username = data.user.users[0].displayName;
    return username;
  }
  return null;
}


//Merges data retrived from api
export function mergeData(data) {
  // Define an array of categoryOptionCombos you want to retrieve
  const categoryOptionCombosToRetrieve = ["HllvX50cXC0", "J2Qf1jtZuj8", "rQLFnNXXIL0", "KPP63zJPkOu"];

  let mergedData = data.dataElements.dataElements.map(d => {
      // Initialize an object to store values for different categoryOptionCombos
      const categoryOptionComboValues = {};

      // Iterate through each categoryOptionCombo
      for (const categoryOptionCombo of categoryOptionCombosToRetrieve) {
          // Find the matched value for the data element and current categoryOptionCombo
          const matchedValue = data.dataValues.dataValues.find(dataValue => {
              return (
                    dataValue.dataElement === d.id &&
                    dataValue.categoryOptionCombo === categoryOptionCombo &&
                    dataValue.period === getFormattedDate()
                );
          });

          // Store the value or assign -1 if no match is found
          categoryOptionComboValues[categoryOptionCombo] = matchedValue ? matchedValue.value : null;
      }

      return {
          displayName: d.displayName,
          id: d.id,
          values: categoryOptionComboValues,
      };
  });

  return mergedData;
}