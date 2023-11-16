import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { CircularLoader,} from '@dhis2/ui';
import * as CommonUtils from '../CommonUtils';
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead, InputField} from '@dhis2/ui';
import calculateAverageConsumption from './HelperMethods/CalculateAverageConsumption';
import "../Css/Dashboard.css"; 


 //Query to get commodity data
 const dataQuery = {
    dataValues: {
        resource: "/dataValueSets",

        params: ({ orgUnit }) => ({
            orgUnit,
            period: CommonUtils.getFormattedDate()+",202309,202308",
            dataSet: 'ULowA8V3ucd',
            fields: ['id'],
          }),
      
    },
    dataElements: {
        resource: "/dataElements",
        params: {
            fields: ["id", "displayName","period"],
            filter: "displayName:like:Commodities",
        },
    },
};


export function Analysis_dashboard({ orgUnit, setCommodityData, commodityData,setAverageConsumption }) {

    const { loading, error, data } = useDataQuery(dataQuery, {
        variables: {
          orgUnit,
        },
      });

    // Using useEffect since without it would render for each commodity found..
    useEffect(() => {
        
        //Here we store data in an array that holds a dict, easier for access and will set state value for final commodity data
        if (data) {
            let array = [];

            const mergedData = CommonUtils.mergeData(data);
            console.log(mergedData)
            setAverageConsumption(calculateAverageConsumption(data, "rQLFnNXXIL0", ["202308", "202309"]));

            mergedData.map(row => {
                array.push({
                    id: row.id,
                    displayName: row.displayName,
                    administered: row.values["HllvX50cXC0"],
                    endBalance: row.values["J2Qf1jtZuj8"],
                    consumption: row.values["rQLFnNXXIL0"],
                    quantityToBeOrdered: row.values["KPP63zJPkOu"]
                });
             
            });

            setCommodityData(array);
        }
    }, [data]);


    //search filter state
    const [searchInput, setSearchInput] = useState('');

    //filter commodities
    const filteredCommodities = commodityData.filter(item =>
        item.displayName.toLowerCase().startsWith(`commodities - ${searchInput.toLowerCase()}`)
    );
    

    const handleSearchChange = (event) => {
        setSearchInput(event.value);
    };

    //Error handling
    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    //Loading handling
    if (loading) {
        return <CircularLoader large />;
    }
    
    return (
        <div>
            <InputField
            type="text"
            id="search"
            label="Search Commodities"
            placeholder="Type to search..."
            value={searchInput}
            onChange={(value) => handleSearchChange(value)}
            className="input-field"
            />


            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodities</TableCellHead>
                        <TableCellHead>Administered</TableCellHead>
                        <TableCellHead>End Balance</TableCellHead>
                        <TableCellHead>Consumption</TableCellHead>
                        <TableCellHead>Quantity to be ordered</TableCellHead>
                        <TableCellHead>ID</TableCellHead>
                    </TableRowHead>
                </TableHead>
    
                <TableBody>
                    {filteredCommodities.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{item.displayName.replace('Commodities - ', '')}</TableCell>
                            <TableCell>
                                {item.administered}
                            </TableCell>
                            <TableCell>
                                {item.endBalance}
                            </TableCell>
                            <TableCell>
                                {item.consumption}
                            </TableCell>
                            <TableCell>
                                {item.quantityToBeOrdered}
                            </TableCell>
                            <TableCell>{item.id}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
