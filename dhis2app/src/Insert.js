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
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ButtonStrip,
  Button,
  AlertBar,
  SwitchField
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

//TODO: Find a name for representing dispense and add to stock
export function Insert({ orgUnit, mergedDataInput }) {
  const endBalanceCategory = "J2Qf1jtZuj8";
  const consumptionCategory = "rQLFnNXXIL0";

  const [mutate] = useDataMutation(dataMutationQuery);

  const [inputValues, setinputValues] = useState({});
  const [mergedData, setMergedData] = useState(mergedDataInput);
  const [confirmationWindow, setConfirmationWindow] = useState(false);
  const [alert, setAlert] = useState(false);
  const [stockOut, setStockOut] = useState(false);
  const [invalidInp, setInvalidInp] = useState(false);

  const [dispensing, setDispensing] = useState(true);


  const confirm = () => {
    if (mergedDataInput) {
      let empty = false;
        const updatedMergedData = mergedData.map(item => {
          const dispenseInput = inputValues[item.id];
      
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
          
          if (newValue < 0){
            empty = true;
          }

          //only mutate if the value is changed
          if (Number(originalValue) !== Number(newValue) && !empty){
            item.endBalance = newValue;
            console.log("MUTATE SKJER DA")
            //update End Balance value
            mutate({
              value: item.endBalance,
              dataElement: item.id,
              period: formattedDate,
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
                period: formattedDate,
                orgUnit,
                categoryOptionCombo: consumptionCategory,
              });
            }
          }
          return item;
        });

        if (empty){
          console.log("NOT ENOUGHT STOCK")
          setAlert(true);
          setStockOut(true)
        }
        else{
          setMergedData(updatedMergedData);
        }

    }
    setConfirmationWindow(false);
  };
  

  const handleDispenseChange = (e, id) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[id] = e.target.value;
    setinputValues(updatedInputValues);
  };

  function showConfirmationWindow(){
    let negativeInp = false
    //check if all input are positive
    mergedData.forEach((item) => {
      const dispenseInput = inputValues[item.id];
      console.log(dispenseInput)
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

  function cancel(){
    setAlert(false)
  }

  function stock(){
    setStockOut(false)
  }

  function alertNegativInp(){
    setInvalidInp(false);
  }

  function switchDispenseOrAdd(){
    if (dispensing){
      setDispensing(false);
    }
    else{
      setDispensing(true) 
    }
  }
  

  return (
    <div>
      <SwitchField
      checked={dispensing}
        helpText={dispensing ? "You are currently dispensing. Press/switch to add stock" : "You are currently adding stock. Press/switch to dispense"}
        label="Dispense"
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
        {
        mergedDataInput.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.displayName}</TableCell>
              <TableCell>{item.endBalance === null ? 'Needs Update' : item.endBalance}</TableCell>
              <TableCell>{item.consumption === null ? 'Needs Update' : item.consumption}</TableCell>
              <TableCell>
                  <input
                    name="dispense"
                    type="number"
                    min="0"
                    onChange={e => handleDispenseChange(e, item.id)}
                  />
                </TableCell>             
            </TableRow>
          ))
        }
          
        </TableBody>
      </Table>
      <button onClick={showConfirmationWindow}>Update</button>
      {confirmationWindow && (
        <Modal>
          <ModalTitle>{dispensing ? "Confirm dispense" : "Confirm Add to Stock"}</ModalTitle>
          <ModalContent>
              <p>Commodities about to be {dispensing ? "Dispensed" : "Added to Stock"}:</p>
              <ul>
                {mergedDataInput.map((item) => {
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
          <ModalTitle>Not enoguht stock</ModalTitle>
          <ModalContent>
              <ul>
                {mergedDataInput.map((item) => {
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
                Wait until the 14 for restock
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button secondary onClick={stock}>
                Understand
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
      )}
      {alert && (
        <AlertBar 
          actions={[
              { 
                //TODO: make enarby clinics and redirect to this page, when pressed
                  label: 'check nearby clinics',
                  onClick:  cancel 
              },
              {
                  label: 'Cancel',
                  onClick:  cancel 
              }
          ]}
          permanent critical
        >
        Not enought stock
      </AlertBar>
      )}

    </div>
  );
}
