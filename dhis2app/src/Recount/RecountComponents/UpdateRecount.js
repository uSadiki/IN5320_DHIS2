import * as CommonUtils from '../../CommonUtils';

//Updates database and recount transactions
export function UpdateRecount(commodityData, inputValues, updateEndBalance, orgUnit, pushRecount, user, earlierTranactions) {

  // Function to update balance for a given item
  function updateBalance(item){
    const old = item.endBalance;
    item.endBalance = parseInt(inputValues[item.id], 10);        
    updateEndBalance(item, orgUnit);
    return {
      id: item.id,
      fromValue: old,
      toValue: item.endBalance,
    }; 
  }

  // Function to extract commodity name from item displayName
  function getCommodityName(item){
    const displayName = 'Commodities - ';
    return item.displayName.substring(item.displayName.indexOf(displayName) + displayName.length);
  }

  // Check if commodityData is provided, createa new recount dict
  if (commodityData) {
    let newRecountData = {
      ChangedBy: user,
      Date:  CommonUtils.getDateAndTime(),
      Commodities: {},
    };      

    commodityData.forEach(item => {
      if (inputValues[item.id]) newRecountData.Commodities[getCommodityName(item)] = updateBalance(item);
    });  

    //Put it toghether with the earlier dict
    earlierTranactions["Recount:"+ (Object.keys(earlierTranactions).length + 1)] = newRecountData;
  }  

  //Post it
  pushRecount(earlierTranactions);
}
