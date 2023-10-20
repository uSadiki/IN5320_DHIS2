import React from 'react';
import { 
    Modal,
    ModalContent,
    ModalActions, 
    ButtonStrip,
    Button
  } from '@dhis2/ui'
  
//This method will show a window informing the user that the clinic has null values for endBalance which need correction
const DataMissing = ({ handleClickForCorrection }) => {
    return (
      <Modal small>
        <ModalContent>
          This clinic has a null value for endBalance. Please fill in the endBalance value before continuing.
        </ModalContent>
        <ModalActions>
          <ButtonStrip end>
            <Button onClick={handleClickForCorrection} primary>
              Correct data
            </Button>
          </ButtonStrip>
        </ModalActions>
      </Modal>
    );
  };
  
  export default DataMissing;