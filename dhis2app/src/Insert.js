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
  const consumptionCategory = "rQLFnNXXIL0";

  const [mutate] = useDataMutation(dataMutationQuery);

  const [dispenseInputValues, setDispenseInputValues] = useState({});
  const [mergedData, setMergedData] = useState(mergedDataInput);
  const [confirmationWindow, setConfirmationWindow] = useState(false);
  const [alert, setAlert] = useState(false);
  const [stockOut, setStockOut] = useState(false);


  const confirm = () => {
    if (mergedDataInput) {
      let empty = false;
        const updatedMergedData = mergedData.map(item => {
          const dispenseInput = dispenseInputValues[item.id];
      
          const originalValue = item.endBalance;
          const dispenseValue = parseInt(dispenseInput) || 0;
          const newValue = originalValue - dispenseValue
          
          if (dispenseValue > originalValue){
            empty = true;
          }

          //only mutate if the value is changed
          if (Number(originalValue) !== Number(newValue) && !empty){
            item.endBalance = newValue;
            item.consumption = Number(item.consumption) + Number(dispenseValue); 
            console.log("MUTATE SKJER DA")
            //update dispense value
            mutate({
              value: item.endBalance,
              dataElement: item.id,
              period: formattedDate,
              orgUnit,
              categoryOptionCombo: endBalanceCategory,
            });
            //update consumption value
            mutate({
              value: item.consumption,
              dataElement: item.id,
              period: formattedDate,
              orgUnit,
              categoryOptionCombo: consumptionCategory,
            });
          }
          return item;
        });
        if (empty){
          console.log("NOT ENOUGHT STOCK")
          setAlert(true);
          setStockOut(true)
        }
        else{
          console.log("plz dont skje")
          setMergedData(updatedMergedData);
        }

    }
    setConfirmationWindow(false);
  };
  

  const handleDispenseChange = (e, id) => {
    const updatedInputValues = { ...dispenseInputValues };
    updatedInputValues[id] = e.target.value;
    setDispenseInputValues(updatedInputValues);
  };

  function showConfirmationWindow(){
    setConfirmationWindow(true);
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
  

  return (
    <div>
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Commodities</TableCellHead>
            <TableCellHead>End Balance</TableCellHead>
            <TableCellHead>Consumption</TableCellHead>
            <TableCellHead>Dispense</TableCellHead>
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
          <ModalTitle>Confirm Dispense:</ModalTitle>
          <ModalContent>
              <p>Commodities about to be dispensed:</p>
              <ul>
                {mergedDataInput.map((item) => {
                  const dispenseValue = parseInt(dispenseInputValues[item.id]) || 0;
                  if (dispenseValue > 0) {
                    return (
                      <li key={item.id}>
                        {item.displayName} - Dispense: {dispenseValue}
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
                  const dispenseValue = parseInt(dispenseInputValues[item.id]) || 0;
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
