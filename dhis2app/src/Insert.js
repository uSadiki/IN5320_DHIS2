import React, { useState } from 'react';
import {
    ReactFinalForm,
    Button,
} from '@dhis2/ui';

import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui';

import { useDataMutation } from '@dhis2/app-runtime';
import { useDataQuery } from '@dhis2/app-runtime';

function mergeData(data) {
    let mergedData = data.dataElements.dataElements.map(d => {
        let matchedValue = data.dataValues.dataValues.find(dataValue => {
            return dataValue.dataElement === d.id;
        });

        return {
            displayName: d.displayName,
            id: d.id,
            value: matchedValue.value,
        };
    });
    return mergedData;
}

const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, '0');
const formattedDate = `${year}${month}`;

const dataMutationQuery = {
    resource: 'dataValueSets',
    type: 'create',
    dataSet: 'ULowA8V3ucd',
    data: ({ value, dataElement, period, orgUnit }) => ({
        dataValues: [
            {
                dataElement: dataElement,
                period: period,
                orgUnit: orgUnit,
                value: value,
            },
        ],
    }),
};

export function Insert({ orgUnit }) {
    const dataQuery = {
        dataValues: {
            resource: '/dataValueSets',
            params: {
                orgUnit,
                period: formattedDate,
                dataSet: 'ULowA8V3ucd',
            },
        },
        dataElements: {
            resource: '/dataElements',
            params: {
                fields: ['id', 'displayName'],
                filter: 'displayName:like:Commodities',
            },
        },
    };

    const [mutate] = useDataMutation(dataMutationQuery);
    const { data } = useDataQuery(dataQuery);

    function onSubmit() {
        if (data) {
            let mergedData = mergeData(data);

            mergedData.forEach(row => {
                const dispenseInput = dispenseInputValues[row.id];
                const addStockInput = addStockInputValues[row.id];

                const originalValue = row.value;
                const dispenseValue = parseFloat(dispenseInput) || 0;
                const addStockValue = parseFloat(addStockInput) || 0;
                const newValue = originalValue - dispenseValue + addStockValue;

                console.log(row.id, newValue);
                mutate({
                    value: newValue,
                    dataElement: row.id,
                    period: formattedDate,
                    orgUnit
                });
            });
        }
    }

    if (data == null) {
        return null;
    }
    let mergedData = mergeData(data);

    const [dispenseInputValues, setDispenseInputValues] = useState({});
    const [addStockInputValues, setAddStockInputValues] = useState({});

    const handleDispenseChange = (e, id) => {
        const updatedInputValues = { ...dispenseInputValues };
        updatedInputValues[id] = e.target.value;
        setDispenseInputValues(updatedInputValues);
    };

    const handleAddStockChange = (e, id) => {
        const updatedInputValues = { ...addStockInputValues };
        updatedInputValues[id] = e.target.value;
        setAddStockInputValues(updatedInputValues);
    };

    return (
        <div>
            <ReactFinalForm.Form onSubmit={onSubmit}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <Table>
                            <TableHead>
                                <TableRowHead>
                                    <TableCellHead>Commodities</TableCellHead>
                                    <TableCellHead>Value</TableCellHead>
                                    <TableCellHead>Dispense</TableCellHead>
                                    <TableCellHead>Add Stock</TableCellHead>
                                </TableRowHead>
                            </TableHead>
                            <TableBody>
                                {mergedData.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.displayName}</TableCell>
                                        <TableCell>{row.value}</TableCell>
                                        <TableCell>
                                            <input
                                                name="dispense"
                                                type="text"
                                                onChange={(e) => handleDispenseChange(e, row.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <input
                                                name="add"
                                                type="text"
                                                onChange={(e) => handleAddStockChange(e, row.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button type="submit" primary>
                            Submit
                        </Button>
                    </form>
                )}
            </ReactFinalForm.Form>
        </div>
    );
}
