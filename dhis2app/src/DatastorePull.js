import { useDataQuery } from '@dhis2/app-runtime';

export function getData(dataStoreKey){
    

    const { data } = useDataQuery(dataKeyQuery)

    if (data) {
        return data.request0

    }
}