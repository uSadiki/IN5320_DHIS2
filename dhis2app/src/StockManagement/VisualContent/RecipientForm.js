import React from 'react';

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
        <label>
          Recipient:  
            <input
            list="recipientOptions"
            name="recipientInput"
            value={recipientInput}
            onChange={handleRecipientInputChange}
          />
        </label>

        <datalist id="recipientOptions">{recipientOptions}</datalist>

        <label htmlFor="department">Department:</label>
        <select name="department" value={department} onChange={changeDepartment} disabled={hasDepartment}>
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