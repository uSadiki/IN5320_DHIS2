import React from 'react';

function RecipientForm({
  dispensing,
  recipientInput,
  handleRecipientInputChange,
  recipientOptions,
  department,
  changeDepartment,
  departments,
}) {
  return (
    dispensing && (
      <div>
        <label>
          Choose a recipient:
          <input
            list="recipientOptions"
            name="recipientInput"
            value={recipientInput}
            onChange={handleRecipientInputChange}
          />
        </label>

        <datalist id="recipientOptions">{recipientOptions}</datalist>

        <label htmlFor="department">Department:</label>
        <select name="department" value={department} onChange={changeDepartment}>
          <option value="Department 1">Department 1</option>
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