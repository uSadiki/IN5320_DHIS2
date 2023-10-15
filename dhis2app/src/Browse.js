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
    let mergedData = data.dataElements.dataElements.map(d => {
      let matchedValue = data.dataValues.dataValues.find(dataValue => {
        return dataValue.dataElement == d.id;
      });
  
      return {
        displayName: d.displayName,
        id: d.id,
        value: matchedValue ? matchedValue.value : 0, /* Add null check */
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
        console.log("stuff starts here")
        let mergedData = mergeData(data)
        console.log(mergedData)
        return (
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>Commodities</TableCellHead>
                        <TableCellHead>Value</TableCellHead>
                        <TableCellHead>ID</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {mergedData.map(row => {
                        console.log(row.value);
                        return (
                            
                            <TableRow key={row.id}>
                                <TableCell>{row.displayName}</TableCell>
                                <TableCell>{row.value}</TableCell>
                                <TableCell>{row.id}</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        )
    }
}
