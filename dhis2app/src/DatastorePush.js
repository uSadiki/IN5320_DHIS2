export function createTransaction(transactions, username, dispensedTo, period, transactionArray, existingTransactions) {
    if (transactions !== null) {
        if (existingTransactions !== null && typeof existingTransactions === 'object') {
            let transactionName = Object.keys(existingTransactions)[Object.keys(existingTransactions).length - 1];

            let transactionNumber = Number(transactionName.split(":")[1]);
            let newTransactionName = `Transaction:${transactionNumber += 1}`;

            existingTransactions[newTransactionName] = {
                dispensedBy: username,
                dispensedTo: dispensedTo,
                date: period,
                Commodities: transactionArray
            };
        }
    } else {
        existingTransactions = {};
        existingTransactions["Transaction:1"] = {
            dispensedBy: username,
            dispensedTo: dispensedTo,
            date: period,
            Commodities: transactionArray
        };
    }
    return existingTransactions;
}


export function createRecipient(recipients, department, dispensedTo, existingRecipients){
    if (Object.keys(recipients).length !== 0){
        const recipientName = Object.keys(existingRecipients)[Object.keys(existingRecipients).length - 1];
        let recipientNumber = Number(recipientName.split(":")[1]);
        let newrecipientName = `Recipient:${recipientNumber+=1}`;
        existingRecipients[newrecipientName] = {
            department: department,
            name: dispensedTo

        };
        
    }
    else{
        existingRecipients["Recipient:1"] = {
            department: department,
            name: dispensedTo
        }
    };

    return existingRecipients;

}