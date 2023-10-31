import { useDataQuery } from '@dhis2/app-runtime';

export function getData(dataStoreKey){
    

    const request = {
        request0: {
        resource: "/dataStore/IN5320-<18>/" + dataStoreKey
        }
    } 

    const { loading, error, data } = useDataQuery(request)

    if (data) {
       return data 
    }
}