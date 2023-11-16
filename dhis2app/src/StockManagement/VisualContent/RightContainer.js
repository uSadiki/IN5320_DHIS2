// LeftContainer.js

import React from 'react';
import {SegmentedControl } from '@dhis2/ui'
import RecipientForm from './RecipientForm';
import '../../Css/dataMan.css';


const RightContainer = ({
 

    setDispensing,
          recipientInput,
          handleRecipientInputChange,
          recipientOptions,
          department,
          changeDepartment,
          departments,
          hasDepartment,
          dispensing,
          showConfirmationWindow
}) => {
  return (
    <div id="right-container">

        <div id="sub-box">
    
    <div className="switch-field-container">
        
            
                <SegmentedControl
            selected={dispensing ? 'dispense' : 'addToStock'}
            onChange={({ value }) => setDispensing(value === 'dispense')}
            options={[
                { value: 'dispense', label: 'Dispense' },
                { value: 'addToStock', label: 'Add to Stock' },
            ]}
            />

     

      </div>

      <div className="recipient-form-container">
        <RecipientForm
          dispensing={dispensing}
          recipientInput={recipientInput}
          handleRecipientInputChange={handleRecipientInputChange}
          recipientOptions={recipientOptions}
          department={department}
          changeDepartment={changeDepartment}
          departments={departments}
          hasDepartment={hasDepartment}
        />
      </div>

      <div className="days-info-container">
       
      </div>
      <button className="update-button" onClick={showConfirmationWindow}>
        Update
      </button>
      </div>

    </div>
  );
};


export default RightContainer;