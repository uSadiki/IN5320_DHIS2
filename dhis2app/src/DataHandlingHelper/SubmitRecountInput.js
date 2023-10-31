import { getData } from '../DatastorePull';
const currentDateTime = new Date();
const formattedDateTime = currentDateTime.toLocaleString();


export function SubmitRecountInput(commodityData, inputValues,updateEndBalance,orgUnit,createTransaction2,user,earlierTranactions) {

  const recountKeys = Object.keys(earlierTranactions.request0);
  const recountCount = recountKeys.length;

  const newRecountData = {
    ChangedBy: user, // Provide a valid value for 'user'
    Date: formattedDateTime, // Provide a valid value for 'date'
    Commodities: {},
  };

 
  if (commodityData) {
    commodityData.forEach(item => {
      if (inputValues[item.id]) {
        const userInput = inputValues[item.id];
        const inputValue = parseInt(userInput, 10);
  
        const old = item.endBalance;
        item.endBalance = inputValue;
        updateEndBalance(item, orgUnit);
  
        const commodityTransaction = {
          id: item.id,
          fromValue: old, // Assuming 'old' represents the previous value
          toValue: inputValue,
        };
  
        newRecountData.Commodities[item.displayName.substring(item.displayName.indexOf('Commodities - ') + 'Commodities - '.length)] = commodityTransaction;
      }
    });
  }
  
  // Add the new recount entry with the incremented number
  earlierTranactions.request0["Recount:"+Number(recountCount+1)] = newRecountData;
  

      createTransaction2(earlierTranactions.request0)
  }
 
