import React from 'react';
import { 
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions, 
    ButtonStrip,
    Button
  } from '@dhis2/ui'
  
//This method will show a message to the user that some of the wanted dispenes are not possible because of not enough stock
const DispenseStockOut = ({ stockOut, commodityData, inputValues, stock }) => {
  return (
    <>
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
                      {item.displayName}: {item.endBalance} try to Dispense: {dispenseValue}
                    </li>
                  );
                }
                return null;
              })}
            </ul>
            Wait until the 14th for restock or check for nearby clinics
          </ModalContent>
          <ModalActions>
            
              <Button primary onClick={stock}>
                Check clinics
              </Button>
              <Button secondary onClick={stock}>
                I understand
              </Button>
              
            
          </ModalActions>
        </Modal>
      )}
    </>
  );
};

export default DispenseStockOut;