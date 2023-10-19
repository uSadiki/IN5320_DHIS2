import React, { useState } from 'react';
import { useDataMutation } from '@dhis2/app-runtime';
import * as CommonUtils from './CommonUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead
} from '@dhis2/ui'

import { 
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions
} from '@dhis2/ui'

import { 
  ButtonStrip,
  Button,
  AlertBar,
  SwitchField
} from '@dhis2/ui'


//Data mutation query
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

//TODO: Find a name for representing dispense and add to stock
export function Insert({ orgUnit, commodityData,setActivePage }) {

  const endBalanceCategory = "J2Qf1jtZuj8";
  const consumptionCategory = "rQLFnNXXIL0";
  const administeredCategory = "HllvX50cXC0";

  //Declare states
  const [mutate] = useDataMutation(dataMutationQuery);
  //state with dict of all input values (key=id, value=input)
  const [inputValues, setinputValues] = useState({});
  const [mergedData, setMergedData] = useState(commodityData);
  const [confirmationWindow, setConfirmationWindow] = useState(false);

  //check if dispense > end balance: true if so
  const [stockOut, setStockOut] = useState(false);
  //state for invalid input
  const [invalidInp, setInvalidInp] = useState(false);
  
  //switch between dispense and add
  const [dispensing, setDispensing] = useState(true);

  
  const confirm = () => {
    if (mergedDataInput) {
      let empty = false;
      
        const updatedMergedData = mergedData.map(item => {
          const dispenseInput = inputValues[item.id];
          
          //if value is undefined set to 0
          const originalValue = parseInt(item.endBalance)|| 0;
          const dispenseValue = parseInt(dispenseInput) || 0;

          //check if despensing or adding
          let newValue; 
          if (dispensing){
            newValue = originalValue - dispenseValue
          }
          else{
            newValue = originalValue + dispenseValue
          }
          
          //check if dispense value > end balance
          if (newValue < 0){
            empty = true;
          }

          //only mutate if the value is changed
          if (Number(originalValue) !== Number(newValue) && !empty){
            item.endBalance = newValue;
            //update End Balance value
            mutate({
              value: item.endBalance,
              dataElement: item.id,
              period: CommonUtils.getFormattedDate(),
              orgUnit,
              categoryOptionCombo: endBalanceCategory,
            });

            //only update consumption if dispensing
            if (dispensing){
              item.consumption = Number(item.consumption) + Number(dispenseValue); 
              
              //update consumption value
              mutate({
                value: item.consumption,
                dataElement: item.id,
                period: CommonUtils.getFormattedDate(),
                orgUnit,
                categoryOptionCombo: consumptionCategory,
              });
            }
            //only update administered when adding
            else{
              item.administered = Number(item.administered) + Number(dispenseValue); 

              //update administered value
              mutate({
                value: item.administered,
                dataElement: item.id,
                period: CommonUtils.getFormattedDate(),
                orgUnit,
                categoryOptionCombo: administeredCategory,
              });
            }
          }
          return item;
        });
        
        if (empty){
          console.log("NOT ENOUGHT STOCK")
          setStockOut(true)
        }
        //update the table if enough stock to dispense
        else{
          setMergedData(updatedMergedData);
        }
    }
    setConfirmationWindow(false);
  };
  
  const handleInputChange = (event, id) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[id] = event.target.value;
    setinputValues(updatedInputValues);
  };

//called when pressing update
//checks for valid input and calls/shows the confirmation window if success
  function showConfirmationWindow(){
    let negativeInp = false
    //check if all input are positive
    mergedData.forEach((item) => {
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
  const handleClickForData = () => {
    setActivePage("UpdateStock");
};
  
let dataMissing = false;


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
          if (item.endBalance === null) {
            dataMissing = true;
          }

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
        <Modal>
          <ModalTitle>{dispensing ? "Confirm dispense" : "Confirm Add to Stock"}</ModalTitle>
          <ModalContent>
              <p>Commodities about to be {dispensing ? "Dispensed" : "Added to Stock"}:</p>
              <ul>
                {commodityData.map((item) => {
                  const dispenseValue = parseInt(inputValues[item.id]) || 0;
                  if (dispenseValue > 0) {
                    return (
                      <li key={item.id}>
                        {item.displayName} - {dispensing ? "Dispense" : "Add"}: {dispenseValue}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button secondary onClick={decline}>
                Decline
              </Button>
              <Button primary onClick={confirm}>
                Confirm
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
      {stockOut && (
        <Modal>
          <ModalTitle>Not enough stock</ModalTitle>
          <ModalContent>
              <ul>
                {commodityData.map((item) => {
                  const dispenseValue = parseInt(inputValues[item.id]) || 0;
                  if (dispenseValue > item.endBalance) {
                    return (
                      <li key={item.id}>
                        {item.displayName}: {item.endBalance} tryed to Dispense: {dispenseValue}
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
                Wait until the 14 for restock or check for nearby clinics
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button secondary onClick={stock}>
                I understand
              </Button>
              <Button primary onClick={stock}>
                check clinics
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
          {dataMissing && 
          <Modal small>
              <ModalContent>
              This clinic has null value for endBalance, please fill in endBalance value before continuing              
              </ModalContent>
                  <ModalActions>
                    <ButtonStrip end>      
                       <Button onClick={handleClickForData} primary>
                        Correct data                     
                        </Button>
                    </ButtonStrip>
                  </ModalActions>
           </Modal> 
           }
    </div>
  );
}
