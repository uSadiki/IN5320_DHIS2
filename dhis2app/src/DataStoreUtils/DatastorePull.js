import { useDataQuery } from '@dhis2/app-runtime';
import { useMemo } from 'react';

export function getData(dataStoreKey) {
    const dataKeyQuery = useMemo(() => ({
        request0: {
            resource: "/dataStore/IN5320-<18>/" + dataStoreKey
        }
    }), [dataStoreKey]); 

    const { data, error, loading } = useDataQuery(dataKeyQuery)

    // handle/loading error 
    if (loading) return;  
    if (error) { console.error(error); return; }

    if (data) {
        return data.request0
    }
}