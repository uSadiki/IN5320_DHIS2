import { useDataQuery } from '@dhis2/app-runtime';

export function getTransactions(){
    //GET transactions
    const transactionQuery = {
        request0: {
        resource: "/dataStore/IN5320-<18>/Transactions"
        }
    };

    const { data } = useDataQuery(transactionQuery);
    let transaction;
    if (data) {
        console.log("data", data);
        transaction = data.request0;
        console.log("TRANSSNSN" ,Object.keys(transaction).length);
        if (Object.keys(transaction).length > 0){
            return transaction
        }
        else{
            return null
        }
    }
    return null;
}