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

    function onCancleClick (){
  
      return (
        setSelectedOrgUnit(null)
    )
      
      ;}

  return (
    <>
      <Modal>
     
        <ModalTitle>{orgUnitName}</ModalTitle>
        <ModalContent>
          Information: Number, location
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

             
                </DataTableRow>
            </TableHead>
            <TableBody>

              {mergedData2.map(item => (
                <DataTableRow key={item.id}>
                  <DataTableCell>{item.displayName.replace('Commodities - ', '')}</DataTableCell>
                  <DataTableCell>{item.values['J2Qf1jtZuj8']}</DataTableCell>
                
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
          
            </ButtonStrip>
          </ModalActions>
      </Modal>
       
     

  

    </>
  );
}

export default DataFetchingComponent;
