//This method will handle update logic, it will handle input for each commidity data, and update only those which has input
//Deppending on dispensing or stocking it will update different CoCatOption values
export function UpdateConfirmLogic(commodityData, inputValues, dispensing, setStockOut, updateEndBalance, updateConsumption, updateAdministered, orgUnit, setConfirmationWindow) {
    if (commodityData) {
        let empty = false;
        
        commodityData.map(item => {
            const userInput = inputValues[item.id];
            // if value is undefined set to 0
            const originalValue = parseInt(item.endBalance) || 0;
            const inputValue = parseInt(userInput) || 0;
            
            // check if dispensing or adding
            let newValue; 
            if (dispensing) {
                newValue = originalValue - inputValue;
            } else {
                newValue = originalValue + inputValue;
            }
            
            // check if dispense value > end balance
            if (newValue < 0) {
                empty = true;
            }
            
            // only mutate if the value is changed
            if (Number(originalValue) !== Number(newValue) && !empty) {
                item.endBalance = newValue;
                updateEndBalance(item, orgUnit);
                
                // only update consumption if dispensing
                if (dispensing) {
                    item.consumption = Number(item.consumption) + Number(inputValue); 
                    updateConsumption(item, orgUnit);
                } else {
                    item.administered = Number(item.administered) + Number(inputValue); 
                    updateAdministered(item, orgUnit);   
                }
            }
            return item;
        });
        
        if (empty) {
            setStockOut(true);
        } 
    }
    setConfirmationWindow(false);
}