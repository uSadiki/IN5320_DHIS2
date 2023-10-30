import React, { useState } from 'react';
import { useMutation } from './DataHandlingHelper/DataMutation'; 
import DispenseStockOut from './Notification/DispenseStockOut';
import DataMissing from './Notification/DataMissing';
import ConfirmationWindow from './Notification/ConfirmationWindow';
import { UpdateConfirmLogic } from './DataHandlingHelper/UpdateConfirmLogic';
import { getUserName } from './DataHandlingHelper/UserName';
import { getTransactions } from './DataHandlingHelper/Transactions';
import * as CommonUtils from './CommonUtils';
import { getData } from './DatastorePull';

import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  AlertBar,
  SwitchField,
} from '@dhis2/ui'

//TODO: Find a name for representing dispense and add to stock
export function DataManagement({ orgUnit, commodityData,setActivePage }) {

  //    !!!    STATE declaration    !!!
  const { updateEndBalance, updateConsumption,updateAdministered, pushTransaction, pushRecipients } = useMutation();

  //state with dict of all input values (key=id, value=input)
  const [inputValues, setinputValues] = useState({});
  

  const [confirmationWindow, setConfirmationWindow] = useState(false);

  //check if dispense > end balance: true if so
  const [stockOut, setStockOut] = useState(false);
  //state for invalid input
  const [invalidInp, setInvalidInp] = useState(false);
  
  
  //switch between dispense and add
  const [dispensing, setDispensing] = useState(true);

  const [department, setDepartment] = useState("Department 1");
  const departments = ['Department 2', 'Department 3'];

  
  const [recipientInput, setRecipientInput] = useState('');


  //Check for missing data
  let dataMissing = false;
  //Confirms if input values are valid and if enough stock
  let username = getUserName();
  let transactions = getTransactions();
  let recipients = getData("Recipients");
  const confirm = () => {
    let period =  CommonUtils.getDateAndTime();
    UpdateConfirmLogic(commodityData, inputValues, recipientInput , dispensing, setStockOut, updateEndBalance, updateConsumption, updateAdministered, orgUnit, setConfirmationWindow, username, transactions, pushTransaction, period, recipients, pushRecipients, department);
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
  
  const changeDepartment = (event) => {
    setDepartment(event.target.value);
  };

  //Handling onchange data for inputs
  const handleInputChange = (event, id) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[id] = event.target.value;
    setinputValues(updatedInputValues);
  };

  const handleClickForCorrection = () => {
    setActivePage("DataCorrection");
  };

  const handleRecipientInputChange = (event) => {
    setRecipientInput(event.target.value);
  };

  let recipientOptions = [];

  if (recipients) {
    recipientOptions = Object.keys(recipients).map((key) => (
      <option key={key} value={recipients[key].name} />
    ));
  }
  
  
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


    {dispensing && (
      <div>
        <label>
          Choose a recipient:
          <input
            list="recipientOptions"
            name="recipientInput"
            value={recipientInput}
            onChange={handleRecipientInputChange}
          />
        </label>

        <datalist id="recipientOptions">
          {recipientOptions}
        </datalist>

    
        <label htmlFor="department">Department:</label>
        <select
          name="department"
          value={department}
          onChange={changeDepartment}
        >
          <option value="Department 1">Department 1</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>
    )}
       
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