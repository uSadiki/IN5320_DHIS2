import React, { useState } from 'react';
import { useMutation } from '../../DataHandlingHelper/DataMutation'; 
import { UpdateRecount } from './UpdateRecount';
import {  Table,  TableBody,  TableCell,  TableCellHead,  TableHead,  TableRow,  TableRowHead,  AlertBar, InputField} from '@dhis2/ui'

//Manages the inputs for recounts
export function RecountManager({ orgUnit, commodityData,user,earlierRecounts }) {
   
  const { updateEndBalance,pushRecount } = useMutation();

  //States and methods
  const [inputValues, setinputValues] = useState({});
  const [invalidInput, setInvalidInput] = useState(false);
  //search filter state
  const [searchInput, setSearchInput] = useState('');

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


  //filter commodities
  const filteredCommodities = commodityData.filter(item =>
      item.displayName.toLowerCase().startsWith(`commodities - ${searchInput.toLowerCase()}`)
  );
  

  const handleSearchChange = (event) => {
      setSearchInput(event.value);
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
          <h1>Stock Recount</h1>

          <InputField
            type="text"
            id="search"
            label="Search Commodities"
            placeholder="Type to search..."
            value={searchInput}
            onChange={(value) => handleSearchChange(value)}
            className="input-field"
            />


          
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
              
                {filteredCommodities.map((item) => {
               
                //Shows commodity data
                return (
                    <TableRow key={item.id}>
                    <TableCell>{item.displayName.replace('Commodities - ', '')}</TableCell>
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
    
        <button className="update-button" onClick={confirm}>Update</button>
         
        </div>
      );
    
    
    };