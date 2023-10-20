import React, { useState } from 'react';
import { useMutation } from './DataHandlingHelper/DataMutation'; 
import DispenseStockOut from './Notification/DispenseStockOut';
import DataMissing from './Notification/DataMissing';
import ConfirmationWindow from './Notification/ConfirmationWindow';
import { UpdateConfirmLogic } from './DataHandlingHelper/UpdateConfirmLogic';
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  AlertBar,
  SwitchField
} from '@dhis2/ui'

//TODO: Find a name for representing dispense and add to stock
export function DataManagement({ orgUnit, commodityData,setActivePage }) {

  //    !!!    STATE declaration    !!!
  const { updateEndBalance, updateConsumption,updateAdministered } = useMutation();

  //state with dict of all input values (key=id, value=input)
  const [inputValues, setinputValues] = useState({});
  const [confirmationWindow, setConfirmationWindow] = useState(false);

  //check if dispense > end balance: true if so
  const [stockOut, setStockOut] = useState(false);
  //state for invalid input
  const [invalidInp, setInvalidInp] = useState(false);
  
  //switch between dispense and add
  const [dispensing, setDispensing] = useState(true);

  //Check for missing data
  let dataMissing = false;

  //Confirms if input values are valid and if enough stock
  const confirm = () => {
    UpdateConfirmLogic(commodityData, inputValues, dispensing, setStockOut, updateEndBalance, updateConsumption, updateAdministered, orgUnit, setConfirmationWindow);
    };

  //called when pressing update, checks for valid input and calls/shows the confirmation window if success
  function showConfirmationWindow(){
    let negativeInp = false
    //check if all input are positive
    commodityData.forEach((item) => {
      const dispenseInput = inputValues[item.id];
      if (Number(dispenseInput) < 0){
        negativeInp = true;
      }
    });

    if (negativeInp === false){
      setConfirmationWindow(true);
    }
    else{
      setInvalidInp(true);
    }
  }

  //   !!!   State handling methods  !!!
  function decline(){
    setConfirmationWindow(false);
  }
  //used for removing modular showing not enough stock
  function stock(){
    setStockOut(false)
  }
  //remove invalid inp alert
  function alertNegativInp(){
    setInvalidInp(false);
  }
  //called when the switch is pressed between dispense and add
  function switchDispenseOrAdd(){
    if (dispensing){
      setDispensing(false);
    }
    else{
      setDispensing(true) 
    }
  }

  //Handling onchange data for inputs
  const handleInputChange = (event, id) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[id] = event.target.value;
    setinputValues(updatedInputValues);
  };

  const handleClickForCorrection = () => {
    setActivePage("DataCorrection");
  };
  
  return (
    <div>
      <SwitchField
      checked={dispensing}
        helpText={dispensing ? "You are currently dispensing. Press/switch to add stock" : "You are currently adding to stock. Press/switch to dispense"}
        label={dispensing ? "Dispense": "Add to Stock"}
        onChange={switchDispenseOrAdd}
        name="switchName"
        value="defaultValue"
      />

      {invalidInp && (
        <AlertBar duration={2000} onHidden={alertNegativInp}>
        Invalid input
        </AlertBar>
      )}
      
    <Table>
        <TableHead>
            <TableRowHead>
            <TableCellHead>Commodities</TableCellHead>
            <TableCellHead>End Balance</TableCellHead>
            <TableCellHead>Consumption</TableCellHead>
            <TableCellHead>{dispensing ? "Dispense" : "Add Stock"}</TableCellHead>
            </TableRowHead>
        </TableHead>

        <TableBody>
            {commodityData.map((item) => {
           
           // Check if endBalance is null and set dataMissing to true
            if (item.endBalance === null) {  dataMissing = true; }

            //Shows commodity data
            return (
                <TableRow key={item.id}>
                <TableCell>{item.displayName}</TableCell>
                <TableCell>
                    {item.endBalance === null ? 'Needs Update' : item.endBalance}
                </TableCell>
                <TableCell>
                    {item.consumption === null ? 'Needs Update' : item.consumption}
                </TableCell>
                <TableCell>
                    <input
                    name="dispense"
                    type="number"
                    min="0"
                    onChange={(e) => handleInputChange(e, item.id)}
                    />
                </TableCell>
                </TableRow>
            );
            })}

        </TableBody>
    </Table>

    <button onClick={showConfirmationWindow}>Update</button>
     
    
    {confirmationWindow && (
        <ConfirmationWindow
        dispensing={dispensing}
        commodityData={commodityData}
        inputValues={inputValues}
        decline={decline}
        confirm={confirm} />
     )}

    {stockOut && (
        <DispenseStockOut
        stockOut={stockOut}
        commodityData={commodityData}
        inputValues={inputValues}
        stock={stock} />
     )}

    {dataMissing &&  <DataMissing handleClickForCorrection={handleClickForCorrection} /> }

    </div>
  );
}
