import React, { useState } from 'react';
import { 
  TableCell,
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    TableHead,DataTable,DataTableRow,DataTableColumnHeader,TableBody,DataTableCell,
    AlertBar,AlertStack
  } from '@dhis2/ui'
  

function mergeData(data) {
  // Define an array of categoryOptionCombos you want to retrieve
  const categoryOptionCombosToRetrieve = ["HllvX50cXC0", "J2Qf1jtZuj8", "rQLFnNXXIL0", "KPP63zJPkOu"];

  let mergedData = data.dataElements.dataElements.map(d => {
      // Initialize an object to store values for different categoryOptionCombos
      const categoryOptionComboValues = {};

      // Iterate through each categoryOptionCombo
      for (const categoryOptionCombo of categoryOptionCombosToRetrieve) {
          // Find the matched value for the data element and current categoryOptionCombo
          const matchedValue = data.dataValues.dataValues.find(dataValue => {
              return dataValue.dataElement === d.id && dataValue.categoryOptionCombo === categoryOptionCombo;
          });

          // Store the value or assign -1 if no match is found
          categoryOptionComboValues[categoryOptionCombo] = matchedValue ? matchedValue.value : null;
      }

      return {
          displayName: d.displayName,
          id: d.id,
          values: categoryOptionComboValues,
      };
  });

  return mergedData;
}

function DataFetchingComponent({   data, orgUnitName, setSelectedOrgUnit, setRequested }) {
  let mergedData2 = mergeData(data);
  const [inputValues, setinputValues] = useState({});
  const [confirmationWindow, setConfirmationWindow] = useState(false);



  const handleInputChange = (event, id) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[id] = event.target.value;
    setinputValues(updatedInputValues);
  };

  function showConfirmationWindow(){
    let negativeInp = false
    //check if all input are positive
    mergedData2.forEach((item) => {
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

    function onCancleClick (){
  
      return (
        setSelectedOrgUnit(null)
    )
      
      ;}

      function request (){
  
        return (
          setRequested(true),
          setSelectedOrgUnit(null)
          
      )
        
        ;}
  return (
    <>
      <Modal>
        
        <ModalTitle>{orgUnitName}</ModalTitle>
        <ModalContent>
          <DataTable>
            <TableHead>
              <DataTableRow>
              <DataTableColumnHeader
                  filter={onCancleClick}
                  name="commodity"
                  
                >
                  Commodity
      
                </DataTableColumnHeader>
                <DataTableColumnHeader
                 
                >
                  End Balance
                </DataTableColumnHeader>

                <DataTableColumnHeader
                 
                 >
                   Amount
                 </DataTableColumnHeader>
                </DataTableRow>
            </TableHead>
            <TableBody>

              {mergedData2.map(item => (
                <DataTableRow key={item.id}>
                  <DataTableCell>{item.displayName.replace('Commodities - ', '')}</DataTableCell>
                  <DataTableCell>{item.values['J2Qf1jtZuj8']}</DataTableCell>
                  <DataTableCell>
                    <input
                    name="dispense"
                    type="number"
                    min="0"
                    onChange={(e) => handleInputChange(e, item.id)}
                    />
                </DataTableCell>
                </DataTableRow>
              ))}
            </TableBody>
          </DataTable>
        </ModalContent>
        <ModalActions>
            <ButtonStrip end>
              <Button secondary onClick={onCancleClick}>
                Cancle
              </Button>
              <Button primary onClick={showConfirmationWindow}>
                Request amount
              </Button>
            </ButtonStrip>
          </ModalActions>
      </Modal>
       
     

      {confirmationWindow && (
        <>
        <Modal>
          <ModalTitle>{"Request"}</ModalTitle>
          <ModalContent>
            <p>Commodities about to be requested:</p>
            <ul>

              {mergedData2.map((item) => {
                const dispenseValue = parseInt(inputValues[item.id]) || 0;
                if (dispenseValue > 0) {
                  return (
                    <li key={item.id}>
                      {item.displayName +" : "+ dispenseValue}
                    </li>
                  );
                }
                return null;
              })}


            </ul>
          </ModalContent>
          <ModalActions>
            <ButtonStrip end>
              <Button secondary onClick={onCancleClick}>
                Decline
              </Button>
              <Button primary onClick={request}>
                Confirm
              </Button>
            </ButtonStrip>
          </ModalActions>
        </Modal>
           </>
     )}

    </>
  );
}

export default DataFetchingComponent;
