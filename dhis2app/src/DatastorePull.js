import { useDataQuery } from '@dhis2/app-runtime';

export function getData(dataStoreKey){

    //GET transactions
    
    

    const dataKeyQuery = {
        request0: {
        resource: "/dataStore/IN5320-<18>/" + dataStoreKey
        }
    } 

    const { loading, error, data } = useDataQuery(dataKeyQuery)
    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <span>Loading...</span>
    }

    if (data) {
        return data
    }

 

}