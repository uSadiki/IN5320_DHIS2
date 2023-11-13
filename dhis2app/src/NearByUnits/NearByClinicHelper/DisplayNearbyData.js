import React from 'react';
import {  Modal, ModalTitle,ModalContent, ModalActions, ButtonStrip, Button, TableHead,DataTable,DataTableRow,DataTableColumnHeader,TableBody,DataTableCell} from '@dhis2/ui'
import * as CommonUtils from '../../CommonUtils';



//Display data in a modal for selected org unit
function DisplayNearbyData({ data, orgUnitName, setSelectedOrgUnit }) {
  let mergedData = CommonUtils.mergeData(data);

  function onCancleClick (){
      return (setSelectedOrgUnit(null))
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

              <DataTableColumnHeader> Commodity </DataTableColumnHeader>
              <DataTableColumnHeader> End Balance </DataTableColumnHeader>
              
              </DataTableRow>
            </TableHead>

            <TableBody>

              {mergedData.map(item => (
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

export default DisplayNearbyData;