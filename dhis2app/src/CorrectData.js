import React, { useState, useEffect } from 'react';
import { useMutation } from './DataHandlingHelper/DataMutation';
import { submitCorrectedInput } from './DataHandlingHelper/SubmitCorrectedInput'; 
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from '@dhis2/ui'

export function CorrectData({ orgUnit, commodityData,setActivePage  }) {
  
  //State Declaration 
  const { updateEndBalance, updateConsumption,updateAdministered,updateQuantityToBeOrdered } = useMutation();
  const [administeredInput, setAdministeredInput] = useState({});
  const [endBalanceInput, setEndBalanceInput] = useState({});
  const [consumptionInput, setConsumptionInput] = useState({});
  const [quantityToBeOrderedInput, setQuantityToBeOrderedInput] = useState({});
  
  //Make a method which holds the submit logic from the component
  const onSubmit = () => {

    //Calls a method that will submit the inserted corrections, it takes inn data, inputs and update methods
    submitCorrectedInput(
      commodityData,
      administeredInput,
      endBalanceInput,
      consumptionInput,
      quantityToBeOrderedInput,
      orgUnit,
      updateAdministered,
      updateEndBalance,
      updateConsumption,
      updateQuantityToBeOrdered,
      setActivePage
    );
  };
  
  //Switch method to handle state changes
  const handleInputChange = (e, id, inputType) => {
    const updatedInputValues = { ...inputType };
    updatedInputValues[id] = e.target.value;
    switch (inputType) {
      case "administered":
        setAdministeredInput(updatedInputValues);
        break;
      case "endBalance":
        setEndBalanceInput(updatedInputValues);
        break;
      case "consumption":
        setConsumptionInput(updatedInputValues);
        break;
      case "quantityToBeOrdered":
        setQuantityToBeOrderedInput(updatedInputValues);
        break;
      default:
        break;
    }
  };

  //This methods create input cells for different types, made to make code simpler
  const CreateInputCell = (item, inputType) => (
  <TableCell key={inputType}>
    <input
      name={`${inputType}Value`}
      type="text"
      placeholder={item[inputType] !== null ? item[inputType] : "null"}
      onChange={e => handleInputChange(e, item.id, inputType)}
    />
  </TableCell>
  );

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
            commodityData.map((item) => (
                <TableRow key={item.id}>
                <TableCell>{item.displayName}</TableCell>
                {CreateInputCell(item, "administered")}
                {CreateInputCell(item, "endBalance")}
                {CreateInputCell(item, "consumption")}
                {CreateInputCell(item, "quantityToBeOrdered")}
              </TableRow>
              ))
            }
          
        </TableBody>
      </Table>
      <button onClick={onSubmit}>Update</button>
    </div>
  );
}
