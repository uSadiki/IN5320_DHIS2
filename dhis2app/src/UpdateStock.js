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

export function UpdateStock({ orgUnit, mergedDataInput }) {
  


  const [mutate] = useDataMutation(dataMutationQuery);

  const [administeredInput, setAdministeredInput] = useState({});
  const [endBalanceInput, setEndBalanceInput] = useState({});
  const [consumptionInput, setConsumptionInput] = useState({});
  const [quantityToBeOrderedInput, setQuantityToBeOrderedInput] = useState({});
  const [mergedData, setMergedData] = useState(mergedDataInput);


  const onSubmit = () => {
    if (mergedDataInput) {
      mergedData.forEach(item => {
        const administeredInputValue = parseInt(administeredInput[item.id]) || -1;
        const consumptionInputValue = parseInt(consumptionInput[item.id]) || -1;
        const quantityToBeOrderedInputValue = parseInt(quantityToBeOrderedInput[item.id]) || -1;
        const endBalanceInputValue = parseInt(endBalanceInput[item.id]) || -1;
  
        // Check if any of the input values have changed
        const hasChanges =
          administeredInputValue !== -1 ||
          consumptionInputValue !== -1 ||
          quantityToBeOrderedInputValue !== -1 ||
          endBalanceInputValue !== -1;
  
        if (hasChanges) {
          // Update the item's properties based on the input values
          if (administeredInputValue !== -1) {
            item.administered = administeredInputValue;
            // Mutate with the appropriate categoryOptionCombo for administered
            mutate({
              value: item.administered,
              dataElement: item.id,
              period: formattedDate,
              orgUnit,
              categoryOptionCombo: "HllvX50cXC0",
            });
          }
          if (consumptionInputValue !== -1) {
            item.consumption = consumptionInputValue;
            // Mutate with the appropriate categoryOptionCombo for consumption
            mutate({
              value: item.consumption,
              dataElement: item.id,
              period: formattedDate,
              orgUnit,
              categoryOptionCombo: "rQLFnNXXIL0",
            });
          }
          if (quantityToBeOrderedInputValue !== -1) {
            item.quantityToBeOrdered = quantityToBeOrderedInputValue;
            // Mutate with the appropriate categoryOptionCombo for quantityToBeOrdered
            mutate({
              value: item.quantityToBeOrdered,
              dataElement: item.id,
              period: formattedDate,
              orgUnit,
              categoryOptionCombo: "KPP63zJPkOu",
            });
          }
          if (endBalanceInputValue !== -1) {
            item.endBalance = endBalanceInputValue;
            // Mutate with the appropriate categoryOptionCombo for endBalance
            mutate({
              value: item.endBalance,
              dataElement: item.id,
              period: formattedDate,
              orgUnit,
              categoryOptionCombo: "J2Qf1jtZuj8",
            });
          }
        }
      });
    }
  };
  


  const handlesetEndBalanceChange = (e, id) => {
    const updatedInputValues = { ...endBalanceInput };
    updatedInputValues[id] = e.target.value;
    setEndBalanceInput(updatedInputValues);
  };
  const handleAdministeredInputChange = (e, id) => {
    const updatedInputValues = { ...administeredInput };
    updatedInputValues[id] = e.target.value;
    setAdministeredInput(updatedInputValues);
  };
  const handleConsumptionInputChange = (e, id) => {
    const updatedInputValues = { ...consumptionInput };
    updatedInputValues[id] = e.target.value;
    setConsumptionInput(updatedInputValues);
  };
  const handleQuantityToBeOrderedInputChange = (e, id) => {
    const updatedInputValues = { ...quantityToBeOrderedInput };
    updatedInputValues[id] = e.target.value;
    setQuantityToBeOrderedInput(updatedInputValues);
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
          </TableRowHead>
        </TableHead>
        <TableBody>
        {
        mergedDataInput.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.displayName}</TableCell>

              <TableCell>
                  <input
                    name="administeredValue"
                    type="text"
                    placeholder={item.administered !== null ? item.administered : "null"}
                    onChange={e => handleAdministeredInputChange(e, item.id)}
                  />
                </TableCell>

                <TableCell>
                  <input
                    name="endBalanceValue"
                    type="text"
                    placeholder={item.endBalance !== null ? item.endBalance : "null"}
                    onChange={e => handlesetEndBalanceChange(e, item.id)}
                  />
                </TableCell>

                <TableCell>
                  <input
                    name="consumptionValue"
                    type="text"
                    placeholder={item.consumption !== null ? item.consumption : "null"}
                    onChange={e => handleConsumptionInputChange(e, item.id)}
                  />
                </TableCell>

              <TableCell>
                  <input
                    name="quantityToBeOrderedValue"
                    type="text"
                    placeholder={item.quantityToBeOrdered !== null ? item.quantityToBeOrdered : "null"}

                    onChange={e => handleQuantityToBeOrderedInputChange(e, item.id)}
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
