//This method will handle update logic, it will handle input for each commidity data, and update only those which has input
//Deppending on dispensing or stocking it will update different CoCatOption values
export function UpdateConfirmLogic(commodityData, inputValues, dispensedToValues ,dispensing, setStockOut, updateEndBalance, updateConsumption, updateAdministered, orgUnit, setConfirmationWindow, username, transactions, createTransaction) {
    if (commodityData) {
        let empty = false;
        console.log(username)
        console.log(transactions)
        let transactionArray = []
        let existingTransactions = transactions || {};

        
        commodityData.map(item => {
            const userInput = inputValues[item.id];
            const dispensedTo = dispensedToValues;
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

                    const newTransaction = {
                        dispensedTo: dispensedTo,
                        dispensedBy: username,
                        commodityID: item.id,
                        value: inputValue,
                    };

                    transactionArray.push(newTransaction)

                } else {
                    item.administered = Number(item.administered) + Number(inputValue); 
                    updateAdministered(item, orgUnit);   
                }
            }
            return item;
        });
        
        if (transactions !== null){
            console.log("exist transaction");
            if (Object.keys(existingTransactions).length > 0) {
                let transactionName = Object.keys(existingTransactions)[Object.keys(existingTransactions).length - 1];
                console.log("TRANSACTION", transactionName);

                let transactionNumber = Number(transactionName.split(":")[1]);
                let newTransactionName = `Transaction:${transactionNumber+=1}`;
                console.log("newName", newTransactionName);

                existingTransactions[newTransactionName] = transactionArray;
            }
        }else{
            console.log("TRANS shit DHBH", transactionArray)
            existingTransactions["Transaction:1"] = transactionArray
        }
        createTransaction(existingTransactions);

        if (empty) {
            setStockOut(true);
        } 
    }
    setConfirmationWindow(false);
}