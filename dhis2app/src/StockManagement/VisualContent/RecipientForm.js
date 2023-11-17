import React from 'react';
import '../../Css/ManagementMain.css';

function RecipientForm({
  dispensing,
  recipientInput,
  handleRecipientInputChange,
  recipientOptions,
  department,
  changeDepartment,
  departments,
  hasDepartment,
  
}) {
  return (
    dispensing && (
      <div>
        <label className='recipientLabel'>
          Recipient:
          <br></br>  
            <input
            className='recipientInput'
            list="recipientOptions"
            name="recipientInput"
            value={recipientInput}
            onChange={handleRecipientInputChange}
          />
        </label>

        <datalist id="recipientOptions">{recipientOptions}</datalist>
        <br></br>
        <label htmlFor="department" className='recipientLabel'>Department:</label>
        <br></br>
        <select
          className='recipientInput' 
          name="department" 
          value={department} 
          onChange={changeDepartment} 
          disabled={hasDepartment}>
          <option value="">Select department</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>
    )
  );
}

export default RecipientForm;