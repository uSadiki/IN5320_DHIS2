//This method takes in inputs and methods from the correctData.js
//It will for each commodity and CoCatOption fetch filled input and use the methods from DataMutation.js to update the database
//With these inputs
export function submitCorrectedInput(
    commodityData,
    administeredInput,
    endBalanceInput,
    consumptionInput,
    quantityToBeOrderedInput,
    orgUnit,
    updateAdministered,
    updateEndBalance,
    updateConsumption,
    updateQuantityToBeOrdered,setActivePage
  ) {
    if (commodityData) {
      commodityData.forEach(item => {
        const administeredInputValue = parseInt(administeredInput[item.id]) || -1;
        const consumptionInputValue = parseInt(consumptionInput[item.id]) || -1;
        const quantityToBeOrderedInputValue = parseInt(quantityToBeOrderedInput[item.id]) || -1;
        const endBalanceInputValue = parseInt(endBalanceInput[item.id]) || -1;
  
        // Check if any of the input values have changed
        const hasChanges =
          administeredInputValue !== -1 ||
          consumptionInputValue !== -1 ||
          quantityToBeOrderedInputValue !== -1 ||
          endBalanceInputValue !== -1;
  
        if (hasChanges) {
          // Update the item's properties based on the input values
          if (administeredInputValue !== -1) {
            item.administered = administeredInputValue;
            updateAdministered(item, orgUnit);
          }
          if (consumptionInputValue !== -1) {
            item.consumption = consumptionInputValue;
            // Mutate with the appropriate categoryOptionCombo for consumption
            updateConsumption(item, orgUnit);
          }
          if (quantityToBeOrderedInputValue !== -1) {
            item.quantityToBeOrdered = quantityToBeOrderedInputValue;
            updateQuantityToBeOrdered(item, orgUnit);
          }
          if (endBalanceInputValue !== -1) {
            item.endBalance = endBalanceInputValue;
            updateEndBalance(item, orgUnit);
          }
        }
      });
    } 
  }