import React, { useState } from 'react';
import { useMutation } from '../../DataHandlingHelper/DataMutation'; 
import { UpdateRecount } from './UpdateRecount';
import {  Table,  TableBody,  TableCell,  TableCellHead,  TableHead,  TableRow,  TableRowHead,  AlertBar} from '@dhis2/ui'

//Manages the inputs for recounts
export function RecountManager({ orgUnit, commodityData,user,earlierRecounts }) {
   
  const { updateEndBalance,pushRecount } = useMutation();

  //States and methods
  const [inputValues, setinputValues] = useState({});
  const [invalidInput, setInvalidInput] = useState(false);

  //Crated for AlertBar
  function alertNegativInp(){
    setInvalidInput(false);
  }

 
  //Handling onchange data for inputs
  const handleInputChange = (event, id) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[id] = event.target.value;
    setinputValues(updatedInputValues);
  };

    //Method to sumbitRecount inputs
    const confirm = () => {
        //Check for negative inputs
        for (const value of Object.values(inputValues)) {
          if (parseFloat(value) < 0) {
            setInvalidInput(true);
            return; 
          }
        }
        setInvalidInput(false); 
        UpdateRecount(commodityData, inputValues , updateEndBalance, orgUnit,pushRecount,user,earlierRecounts);
      };
      return (

   
        <div> 
          {invalidInput && (
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
    
    
    };