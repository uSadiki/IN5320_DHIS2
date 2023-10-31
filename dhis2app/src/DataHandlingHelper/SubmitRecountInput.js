import { getData } from '../DatastorePull';
import * as CommonUtils from '../CommonUtils';



export function SubmitRecountInput(commodityData, inputValues,updateEndBalance,orgUnit,createTransaction2,user,earlierTranactions) {

  const recountKeys = Object.keys(earlierTranactions);
  const recountCount = recountKeys.length;

  const newRecountData = {
    ChangedBy: user, // Provide a valid value for 'user'
    Date:  CommonUtils.getDateAndTime(), // Provide a valid value for 'date'
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
  earlierTranactions["Recount:"+Number(recountCount+1)] = newRecountData;
  

      createTransaction2(earlierTranactions)
  }
 
