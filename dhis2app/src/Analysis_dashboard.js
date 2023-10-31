import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { CircularLoader,} from '@dhis2/ui';
import * as CommonUtils from './CommonUtils';
import DataMissing from './Notification/DataMissing';
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui';

function calculateAverageConsumption(data) {
    // Define the categoryOptionCombo and periods you want to retrieve
    const categoryOptionComboToRetrieve = "rQLFnNXXIL0";
    const periodsToRetrieve = ["202308", "202309"];

    const averageConsumptionData = {};

    // Iterate through the data for each commodity
    data.dataElements.dataElements.forEach(d => {
        // Initialize variables to store total consumption and the count of periods with data
        let totalConsumption = 0;
        let periodCount = 0;

        // Iterate through the specified periods
        for (const period of periodsToRetrieve) {
            // Find the matched value for the data element, categoryOptionCombo, and period
            const matchedValue = data.dataValues.dataValues.find(dataValue => {
                return (
                    dataValue.dataElement === d.id &&
                    dataValue.categoryOptionCombo === categoryOptionComboToRetrieve &&
                    dataValue.period === period
                );
            });

            if (matchedValue && matchedValue.value !== null) {
                totalConsumption += parseFloat(matchedValue.value);
                periodCount++;
            }
        }

        // Calculate the average consumption for the commodity
        const averageConsumption = periodCount > 0 ? totalConsumption / periodCount : null;

        // Store the average consumption in the result object with the commodity's display name as the key
        averageConsumptionData[d.displayName] = averageConsumption;
    });

    return averageConsumptionData;
}


//Method for getting data for each commodity and CatOptCombo
function mergeData(data) {
    // Define an array of categoryOptionCombos you want to retrieve
    const categoryOptionCombosToRetrieve = ["HllvX50cXC0", "J2Qf1jtZuj8", "rQLFnNXXIL0", "KPP63zJPkOu"];

    let mergedData = data.dataElements.dataElements.map(d => {
        // Initialize an object to store values for different categoryOptionCombos
        const categoryOptionComboValues = {};

        // Iterate through each categoryOptionCombo
        for (const categoryOptionCombo of categoryOptionCombosToRetrieve) {
            // Find the matched value for the data element, current categoryOptionCombo, and period '202310'
            const matchedValue = data.dataValues.dataValues.find(dataValue => {
                return (
                    dataValue.dataElement === d.id &&
                    dataValue.categoryOptionCombo === categoryOptionCombo &&
                    dataValue.period === '202310'
                );
            });

            // Store the value or assign -1 if no match is found
            categoryOptionComboValues[categoryOptionCombo] = matchedValue ? matchedValue.value : null;
        }

        return {
            displayName: d.displayName,
            id: d.id,
            values: categoryOptionComboValues,
        };
    });

    return mergedData;
}

export function Analysis_dashboard({ orgUnit, setCommodityData, commodityData, setActivePage,setAverageConsumption }) {

    //Query to get commodity data
    const dataQuery = {
        dataValues: {
            resource: "/dataValueSets",
            params: {
                orgUnit,
                period: CommonUtils.getFormattedDate()+",202309,202308",
                dataSet: "ULowA8V3ucd",
                fields: ["id"],
            },
        },
        dataElements: {
            resource: "/dataElements",
            params: {
                fields: ["id", "displayName","period"],
                filter: "displayName:like:Commodities",
            },
        },
    };

    // var for checking if clinic is missing endBalance value
    let dataMissing = false;
    const { loading, error, data } = useDataQuery(dataQuery);
   
   

    // Using useEffect since without it would render for each commodity found..
    useEffect(() => {
        
        //Here we store data in an array that holds a dict, easier for access and will set state value for final commodity data
        if (data) {
            let array = [];
            let mergedData = mergeData(data);
            setAverageConsumption(calculateAverageConsumption(data))
          
   

            mergedData.map(row => {
                array.push({
                    id: row.id,
                    displayName: row.displayName,
                    administered: row.values["HllvX50cXC0"],
                    endBalance: row.values["J2Qf1jtZuj8"],
                    consumption: row.values["rQLFnNXXIL0"],
                    quantityToBeOrdered: row.values["KPP63zJPkOu"]
                });
                if (row.values["J2Qf1jtZuj8"] === null ) {
                   
                    dataMissing = true;
                }
            });

            setCommodityData(array);
        }
    }, [data]);

    //Error handling
    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    //Loading handling
    if (loading) {
        return <CircularLoader large />;
    }

    //Handle click method for changing activePage
    const handleClickForUpdateStock = () => {
        setActivePage("DataCorrection");
     };

    const handleClickForStartIt = () => {
        setActivePage("StartIt");
     };
    
    return (
      
        <div>
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
                    {commodityData.length === 0 ? (
                          null // First render where we have not set the values
                      ) : (
                        commodityData.map(item => {
                                
                              //If data is missing we will notify the user
                              if (item.endBalance === null ) {
                                  dataMissing = true;
                              }
                              return (
                                  <TableRow key={item.id}>
                                      <TableCell>{item.displayName}</TableCell>
                                      <TableCell>{item.administered === null ? 'Needs Update' : item.administered}</TableCell>
                                      <TableCell>{item.endBalance === null ? 'Needs Update' : item.endBalance}</TableCell>
                                      <TableCell>{item.consumption === null ? 'Needs Update' : item.consumption}</TableCell>
                                      <TableCell>{item.quantityToBeOrdered === null ? 'Needs Update' : item.quantityToBeOrdered}</TableCell>
                                      <TableCell>{item.id}</TableCell>
                                  </TableRow>
                                    );
                                })
                      )}

                </TableBody>
            </Table>
            
            
            {dataMissing && 
            <DataMissing handleClickForCorrection={handleClickForUpdateStock} />
            }
        </div>
    );
}
