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

export function Insert({ orgUnit, mergedDataInput }) {
  const endBalanceCategory = "J2Qf1jtZuj8";


 

  const [mutate] = useDataMutation(dataMutationQuery);

  const [dispenseInputValues, setDispenseInputValues] = useState({});
  const [addStockInputValues, setAddStockInputValues] = useState({});
  const [mergedData, setMergedData] = useState(mergedDataInput);

  const onSubmit = () => {
    if (mergedDataInput) {
        const updatedMergedData = mergedData.map(item => {
          const dispenseInput = dispenseInputValues[item.id];
          const addStockInput = addStockInputValues[item.id];
      
          const originalValue = item.endBalance;
          const dispenseValue = parseInt(dispenseInput) || 0;
          const addStockValue = parseInt(addStockInput) || 0;
          const newValue = originalValue - dispenseValue + addStockValue;
          item.endBalance = newValue; 
          // Update the item so the user sees the updated value
          return item; // Assuming "endBalance" is the property to be updated
          
        });
      
  
      setMergedData(updatedMergedData);
  
      // mutation to update the actual mergedDataInput
      updatedMergedData.forEach(item => {
        mutate({
          value: item.endBalance, // Assuming "endBalance" is the property to be used here
          dataElement: item.id,
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
        {
        mergedDataInput.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.displayName}</TableCell>
              <TableCell>{item.endBalance === null ? 'Needs Update' : item.endBalance}</TableCell>
              <TableCell>
                  <input
                    name="dispense"
                    type="text"
                    onChange={e => handleDispenseChange(e, item.id)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    name="add"
                    type="text"
                    onChange={e => handleAddStockChange(e, item.id)}
                  />
                </TableCell>
             
            </TableRow>
          ))
        }
          
        </TableBody>
      </Table>
      <button onClick={onSubmit}>Update</button>
    </div>
  );
}
