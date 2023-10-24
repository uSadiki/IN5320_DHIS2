import React from 'react';

  import { 
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button
  } from '@dhis2/ui'

//This method will present a confirmation window for wanted dispenses/stockIns.
const ConfirmationWindow = ({ dispensing, commodityData, inputValues, decline, confirm }) => {
  return (
    <>
    <Modal>
      <ModalTitle>{dispensing ? "Confirm dispense" : "Confirm Add to Stock"}</ModalTitle>
      <ModalContent>
        <p>Commodities about to be {dispensing ? "Dispensed" : "Added to Stock"}:</p>
        <ul>
          {commodityData.map((item) => {
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
       </>
  );
};

export default ConfirmationWindow; 