import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { CircularLoader,Button,Modal,ModalContent,ModalActions,ButtonStrip } from '@dhis2/ui';
import { Insert } from "./Insert";

import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui';

function mergeData(data) {
    // Define an array of categoryOptionCombos you want to retrieve
    const categoryOptionCombosToRetrieve = ["HllvX50cXC0", "J2Qf1jtZuj8", "rQLFnNXXIL0", "KPP63zJPkOu"];

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

export function Analysis_dashboard({ orgUnit, setMergedData, mergedData2,setActivePage }) {
    const dataQuery = {
        dataValues: {
            resource: "/dataValueSets",
            params: {
                // TODO: make an option to choose orgunit and period
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
                // all Commodities start with Commodities, filter after that
                filter: "displayName:like:Commodities",
            },
        },
    };
    const { loading, error, data } = useDataQuery(dataQuery);
    let dataMissing = false;

    // Vi må bruke useEffect, eller så rendrer den alt for mange ganger pga dataQuery
    useEffect(() => {
        if (data) {
            let array = [];
            let mergedData = mergeData(data);

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

            setMergedData(array);
        }
    }, [data]);

    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    if (loading) {
        return <CircularLoader large />;
    }

    
    const handleClickForData = () => {
      setActivePage("UpdateStock");
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
                    {mergedData2.length === 0 ? (
                          null // First render where we have not set the values
                      ) : (
                          mergedData2.map(item => {
                             
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
<Modal small>
    <ModalContent>
This clinic has null value for endBalance, please fill in endBalance value before continuing              </ModalContent>
              <ModalActions>
                  <ButtonStrip end>
                      
                      <Button onClick={handleClickForData} primary>
Correct data                      </Button>
                  </ButtonStrip>
              </ModalActions>
          </Modal>



 }
        </div>
    );
}
