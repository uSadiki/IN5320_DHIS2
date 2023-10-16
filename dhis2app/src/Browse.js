import React from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'

import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'


function mergeData(data) {
    // Define an array of categoryOptionCombos you want to retrieve
    const categoryOptionCombosToRetrieve = ["HllvX50cXC0", "J2Qf1jtZuj8", "rQLFnNXXIL0","KPP63zJPkOu"];
  
    let mergedData = data.dataElements.dataElements.map(d => {
      // Initialize an object to store values for different categoryOptionCombos
      const categoryOptionComboValues = {};
  
      // Iterate through each categoryOptionCombo
      for (const categoryOptionCombo of categoryOptionCombosToRetrieve) {
        // Find the matched value for the data element and current categoryOptionCombo
        const matchedValue = data.dataValues.dataValues.find(dataValue => {
          return dataValue.dataElement === d.id && dataValue.categoryOptionCombo === categoryOptionCombo;
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
  
 
  

  const today = new Date();
  const year = today.getFullYear();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const formattedDate = `${year}${month}`;

export function Browse({ orgUnit }) {
    const dataQuery = {
        dataValues: {
          resource: "/dataValueSets",
          params: {
          //TODO: make a option to choose orgunit and period
            orgUnit,
            period: formattedDate,
            dataSet: "ULowA8V3ucd",
            fields: ["id"],

          },
        },
        dataElements: {
          resource: "/dataElements",
          params: {
            fields: ["id", "displayName"],
            //all Commodities starts with Commodities, filter after that
            filter: "displayName:like:Commodities",
          },
        },
      };
    const { loading, error, data } = useDataQuery(dataQuery)
    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
        return <CircularLoader large />
    }

    if (data) {
    
        let mergedData = mergeData(data)
        
        return (
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
                {mergedData.map(row => {
                  console.log(row.values);
                  return (
                    <TableRow key={row.id}>
                      <TableCell>{row.displayName}</TableCell>
                      <TableCell>{row.values["HllvX50cXC0"] === null ? 'Needs Update' : row.values["HllvX50cXC0"]}</TableCell>
                      <TableCell>{row.values["J2Qf1jtZuj8"] === null ? 'Needs Update' : row.values["J2Qf1jtZuj8"]}</TableCell>
                      <TableCell>{row.values["rQLFnNXXIL0"] === null ? 'Needs Update' : row.values["rQLFnNXXIL0"]}</TableCell>
                      <TableCell>{row.values["KPP63zJPkOu"] === null ? 'Needs Update' : row.values["KPP63zJPkOu"]}</TableCell>
                      <TableCell>{row.id}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          );
        
    }
}