import { useDataQuery } from '@dhis2/app-runtime';

export function getData(dataStoreKey){
    

    const dataKeyQuery = {
        request0: {
        resource: "/dataStore/IN5320-<18>/" + dataStoreKey
        }
    } 

    const { data } = useDataQuery(dataKeyQuery)

    if (data) {
        return data.request0
    }

 

}