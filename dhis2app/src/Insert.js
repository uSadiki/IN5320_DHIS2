import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { useDataMutation } from '@dhis2/app-runtime';

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

const dataMutationQuery = {
  resource: 'dataValueSets',
  type: 'create',
  dataSet: 'ULowA8V3ucd',
  data: ({ value, dataElement, period, orgUnit, categoryOptionCombo }) => ({
    dataValues: [
      {
        dataElement: dataElement,
        period: period,
        orgUnit: orgUnit,
        value: value,
        categoryOptionCombo: categoryOptionCombo
      },
    ],
  }),
};

const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, "0");
const formattedDate = `${year}${month}`;

export function Insert({ orgUnit }) {
  const endBalanceCategory = "J2Qf1jtZuj8";

  const dataQuery = {
    dataValues: {
      resource: "/dataValueSets",
      params: {
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
        filter: "displayName:like:Commodities",
      },
    },
  };

  const { loading, error, data } = useDataQuery(dataQuery);
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  const [mutate] = useDataMutation(dataMutationQuery);

  const [dispenseInputValues, setDispenseInputValues] = useState({});
  const [addStockInputValues, setAddStockInputValues] = useState({});
  const [mergedData, setMergedData] = useState(mergeData(data));

  const onSubmit = () => {
    if (data) {
      const updatedMergedData = mergedData.map(row => {
        const dispenseInput = dispenseInputValues[row.id];
        const addStockInput = addStockInputValues[row.id];
  
        const originalValue = row.values[endBalanceCategory];
        const dispenseValue = parseInt(dispenseInput) || 0;
        const addStockValue = parseInt(addStockInput) || 0;
        const newValue = originalValue - dispenseValue + addStockValue;
  
        // Update the mergedData so the user sees the updated value
        return {
          ...row,
          values: {
            ...row.values,
            [endBalanceCategory]: newValue,
          },
        };
      });
  
      setMergedData(updatedMergedData);
  
      // mutation to update the actual data
      updatedMergedData.forEach(row => {
        mutate({
          value: row.values[endBalanceCategory],
          dataElement: row.id,
          period: formattedDate,
          orgUnit,
          categoryOptionCombo: endBalanceCategory,
        });
      });
    }
  };
  

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
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Commodities</TableCellHead>
            <TableCellHead>End Balance</TableCellHead>
            <TableCellHead>Dispense</TableCellHead>
            <TableCellHead>Add Stock</TableCellHead>
          </TableRowHead>
        </TableHead>
        <TableBody>
          {mergedData.map(row => {
            return (
              <TableRow key={row.id}>
                <TableCell>{row.displayName}</TableCell>
                <TableCell>
                  {row.values[endBalanceCategory] === null ? 'Needs Update' : row.values[endBalanceCategory]}
                </TableCell>
                <TableCell>
                  <input
                    name="dispense"
                    type="text"
                    onChange={e => handleDispenseChange(e, row.id)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    name="add"
                    type="text"
                    onChange={e => handleAddStockChange(e, row.id)}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <button onClick={onSubmit}>Update</button>
    </div>
  );
}
