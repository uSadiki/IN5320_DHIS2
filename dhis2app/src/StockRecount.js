import React, { useState } from 'react';
import { useMutation } from './DataHandlingHelper/DataMutation'; 
import { getUserName } from './DataHandlingHelper/UserName';
import { SubmitRecountInput } from './DataHandlingHelper/SubmitRecountInput';
import { getData } from './DatastorePull';
import {  Table,  TableBody,  TableCell,  TableCellHead,  TableHead,  TableRow,  TableRowHead,  AlertBar} from '@dhis2/ui'

//TODO: Find a name for representing dispense and add to stock
export function StockRecount({ orgUnit, commodityData,setActivePage,user }) {
  let earlierTranactions =getData("Recounts")

  //    !!!    STATE declaration    !!!
  const { updateEndBalance,createTransaction2 } = useMutation();

  //state with dict of all input values (key=id, value=input)
  const [inputValues, setinputValues] = useState({});

  
  //state for invalid input
  const [invalidInp, setInvalidInp] = useState(false);
  
  
  //switch between dispense and add
  const [dispensing, setDispensing] = useState(true);

  //Check for missing data
  let dataMissing = false;

  
  const confirm = () => {
    SubmitRecountInput(commodityData, inputValues , updateEndBalance, orgUnit,createTransaction2,user,earlierTranactions);
    };

  //remove invalid inp alert
  function alertNegativInp(){
    setInvalidInp(false);
  }

  //Handling onchange data for inputs
  const handleInputChange = (event, id) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[id] = event.target.value;
    setinputValues(updatedInputValues);
  };


  
  return (
    <div>

      {invalidInp && (
        <AlertBar duration={2000} onHidden={alertNegativInp}>
        Invalid input
        </AlertBar>
      )}
      
    <Table>
      
        <TableHead>
            <TableRowHead>
            <TableCellHead>Commodities</TableCellHead>
            <TableCellHead>Current Balance</TableCellHead>
            <TableCellHead>{"Corrected Balance"}</TableCellHead>
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

    <button onClick={confirm}>Update</button>
     
 

   
    </div>
  );
}