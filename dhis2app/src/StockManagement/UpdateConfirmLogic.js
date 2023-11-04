//This method will handle update logic, it will handle input for each commidity data, and update only those which has input
//Deppending on dispensing or stocking it will update different CoCatOption values

import { createTransaction, createRecipient } from "../DataStoreUtils/TransactionAndRecipientBody";

export function UpdateConfirmLogic(commodityData, inputValues, dispensedToValues ,dispensing, setStockOut, updateEndBalance, updateConsumption, updateAdministered, orgUnit, setConfirmationWindow, username, transactions, pushTransaction, period, recipients, pushRecipients, department) {

const currentDateTime = new Date();
const formattedDateTime = currentDateTime.toLocaleString();

    if (commodityData) {
        let empty = false;
        let transactionArray = []
        let existingTransactions = transactions || {};
        let existingRecipients = recipients || {};

        let recipientStored = false; 
        const dispensedTo = dispensedToValues;
        for (const key in existingRecipients) {
            if (existingRecipients[key].name === dispensedTo) {
                recipientStored = true;
                break;
            }
        }

        
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

                    const newTransaction = {
                        commodityID: item.id,
                        value: inputValue,

                        commodity: item.displayName,

                    };

                    transactionArray.push(newTransaction)

                } else {
                    item.administered = Number(item.administered) + Number(inputValue); 
                    updateAdministered(item, orgUnit);   
                }
            }
            return item;
        });

        //setup transaction on format {"Transaction:1": {"Commodities": [{}],},...}
        existingTransactions = createTransaction(transactions, username, dispensedTo, period, transactionArray, existingTransactions);
        pushTransaction(existingTransactions);

        //setup recipient on format {"Recipient:1": {},...}
        //create and push recipient if not stored in datastore
        if (recipientStored === false) {
            existingRecipients = createRecipient(recipients, department, dispensedTo, existingRecipients);
            pushRecipients(existingRecipients);
        }
        
        
        if (empty) {
            setStockOut(true);
        } 
    }
    setConfirmationWindow(false);
}