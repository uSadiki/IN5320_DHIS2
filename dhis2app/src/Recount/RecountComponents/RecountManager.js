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
          if (Object.keys(inputValues).length === 0 || Object.values(inputValues).every(value => !value || parseFloat(value) <= 0)) {
            setInvalidInput(true);
            return; 
          }
        }
       
        setInvalidInput(false); 
        UpdateRecount(commodityData, inputValues , updateEndBalance, orgUnit,pushRecount,user,earlierRecounts);
        setUpdateSuccess(true);
      };

      const [updateSuccess, setUpdateSuccess] = useState(false);
      const hideSuccessMessage = () => {
        setUpdateSuccess(false);
      };


      const tableStyles = {
        height: '20%', // Adjust the width as needed
        // Add other styles like borderCollapse, margin, etc.
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


          

          {invalidInput ? (
        <AlertBar  className="alert-bar-recount" duration={2000} onHidden={alertNegativInp}>
          Invalid input
        </AlertBar>
      ) : (
        updateSuccess && (
          <AlertBar success className="alert-bar-recount" duration={2000} onHidden={hideSuccessMessage}>
            Successfully updated
          </AlertBar>
        )
      )}
          
        <Table style={tableStyles} >
          
            <TableHead>
                <TableRowHead>
                <TableCellHead>Commodities</TableCellHead>
                <TableCellHead>Current Balance</TableCellHead>
                <TableCellHead>{"Corrected Balance"}</TableCellHead>
                </TableRowHead>
            </TableHead>
    
            <TableBody>
              
                {filteredCommodities.map((item) => {
                const hasInput = inputValues[item.id] !== undefined && inputValues[item.id] !== '' && inputValues[item.id] >0;

               
                //Shows commodity data
                return (
                  <TableRow key={item.id} className={`zebraStriping ${hasInput ? 'highlighted-row' : ''}`}>
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