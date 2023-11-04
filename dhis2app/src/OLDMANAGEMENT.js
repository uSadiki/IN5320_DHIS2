import React, { useState } from 'react';
import { useMutation } from './DataHandlingHelper/DataMutation'; 
import DispenseStockOut from './Notification/DispenseStockOut';
import ConfirmationWindow from './Notification/ConfirmationWindow';
import BalanceInfo from './Notification/BalanceInfo';
import { UpdateConfirmLogic } from './StockManagement/UpdateConfirmLogic';
import * as CommonUtils from './CommonUtils';
import { getData } from './DataStoreUtils/DatastorePull';
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead, AlertBar, SwitchField } from '@dhis2/ui'
import './Css/CssTest.css';
import {DataBody} from'./StockManagement/VisualContent/Databody'


//TODO: Find a name for representing dispense and add to stock
export function DataManagement({ orgUnit, commodityData,setActivePage ,averageConsumption,username}) {
  //    !!!    STATE declaration    !!!
  const { updateEndBalance, updateConsumption,updateAdministered, pushTransaction, pushRecipients } = useMutation();

  //state with dict of all input values (key=id, value=input)
  const [inputValues, setinputValues] = useState({});

  const [dispensedToInput, setDispensedToInput] = useState("");

  const [confirmationWindow, setConfirmationWindow] = useState(false);

  //check if dispense > end balance: true if so
  const [stockOut, setStockOut] = useState(false);
  //state for invalid input
  const [invalidInp, setInvalidInp] = useState(false);
  //switch between dispense and add
  const [dispensing, setDispensing] = useState(true);

  const [department, setDepartment] = useState("Department 1");
  const departments = ['Department 2', 'Department 3'];
  
  const [recipientInput, setRecipientInput] = useState('');

  let transactions = getData("Transactions");
  let recipients = getData("Recipients");

  //New ones for prediction
  let daysUntilNextMonth = CommonUtils.calculateDaysUntilNextMonth();
  const numberOfDailyDispenses = 4;

  const [balanceInfo, setBalanceInfo] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [status, setStatus] = useState(null);
  const [toLargeDispense, setToLargeDispense] = useState(false);
  const [alerts, setAlerts] = useState({});


/*
// CODE TO GET NUMBER OF TRANSACTIONS MADE TODAY
const today = new Date();
today.setHours(0, 0, 0, 0); // Set the time to midnight for comparison
// Assuming 'transactions' is your object with 'Transaction' properties
const commodityCounts = {};
for (const key in transactions) {
  if (transactions.hasOwnProperty(key)) {
    const transaction = transactions[key];
    if (Array.isArray(transaction)) {
      // Handle the case where 'Transaction' is an array
      for (const item of transaction) {
        // Extract the date part from the 'date' key
        const parts = item.date.split(', ')[0];
        const [day, month, year] = parts.split('/');

        // Convert the extracted date to a Date object
        const transactionDate = new Date(`${year}-${month}-${day}`);
        transactionDate.setHours(0, 0, 0, 0); // Set the time to midnight

        // Compare the transaction date with today's date
        if (transactionDate.getTime() === today.getTime()) {
          const commodityID = item.commodityID;
          if (commodityCounts[commodityID]) {
            commodityCounts[commodityID] += 1;
          } else {
            commodityCounts[commodityID] = 1;
          }
        }
      }
    } else {
      // Handle the case where 'Transaction' is an object
      // Extract the date part from the 'date' key
      const parts = transaction.date.split(', ')[0];
      const [day, month, year] = parts.split('/');

      // Convert the extracted date to a Date object
      const transactionDate = new Date(`${year}-${month}-${day}`);
      transactionDate.setHours(0, 0, 0, 0); // Set the time to midnight

      // Compare the transaction date with today's date
      if (transactionDate.getTime() === today.getTime()) {
        const commodityID = transaction.Commodities[0].commodityID;
        if (commodityCounts[commodityID]) {
          commodityCounts[commodityID] += 1;
        } else {
          commodityCounts[commodityID] = 1;
        }
      }
    }
  }
}

*/

  const confirm = () => {
    let period =  CommonUtils.getDateAndTime();
    UpdateConfirmLogic(commodityData, inputValues, recipientInput , dispensing, setStockOut, updateEndBalance, updateConsumption, updateAdministered, orgUnit, setConfirmationWindow, username, transactions, pushTransaction, period, recipients, pushRecipients, department);
    };

  //called when pressing update, checks for valid input and calls/shows the confirmation window if success
  function showConfirmationWindow(){
    let negativeInp = false
    let moredispense = false

    //check if all input are positive
    commodityData.forEach((item) => {
       const dispenseInput = inputValues[item.id];
       
       if ( Number(dispenseInput) > item.endBalance){
        moredispense = false;
      } 
      if (Number(dispenseInput) < 0){
        negativeInp = true;
      }
     
    });
    
    if (negativeInp === false &&  moredispense === false){
      setConfirmationWindow(true);
    }
    else if( moredispense){
      setToLargeDispense(true);
    }
    else{
      setInvalidInp(true);
    }
  }

  //   !!!   State handling methods  !!!
  function decline(){
    setBalanceInfo(false);
    setConfirmationWindow(false);
  }

  function decline2(){
    setBalanceInfo(false);
  }

  function sendToNearbyClinic(){
    setBalanceInfo(false);
    setActivePage("NearbyUnits")
  }

  const showBalanceInfo = (commodity,status) => {
    // Set the selected commodity and show the balance info modal
    setSelectedCommodity(commodity);
    setStatus(status);
    setBalanceInfo(true);
  };


  //used for removing modular showing not enough stock
  function stock(){
    setStockOut(false)
  }

  //remove invalid inp alert
  function alertNegativInp(){
    setInvalidInp(false);
  }

  function alertLargeDispense(){
    setToLargeDispense(false);
  }

  //called when the switch is pressed between dispense and add
  function switchDispenseOrAdd(){
    if (dispensing){
      setDispensing(false);
    }
    else{
      setDispensing(true) 
    }
  }
  
  const changeDepartment = (event) => {
    setDepartment(event.target.value);
  };

  //Handling onchange data for inputs
  const handleInputChange = (event, item, check, xGreen, xOrange) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[item.id] = event.target.value;
    const newAlerts = { ...alerts };

    let recommended;
    if (check === "orange") {
        recommended = (xOrange - 1)/daysUntilNextMonth/numberOfDailyDispenses;
    } else if (check === "green") {
        recommended = (xGreen - 1)/daysUntilNextMonth/numberOfDailyDispenses;
    } else if (check === "red") {
        recommended = (item.endBalance - daysUntilNextMonth)/numberOfDailyDispenses;
    }

    if (event.target.value > recommended) {
        if (recommended === 0) {
            newAlerts[item.id] = 'Further dispenses will increase stockout risk';
        }else if (recommended === -1) {
          newAlerts[item.id] = 'Exceeds daily dispenses';
      } else {
            newAlerts[item.id] = 'Exceeds maximum safe dispense, recommended: ' + Math.ceil(recommended)+' from'+((xGreen - 1)/daysUntilNextMonth);
        }
    } else {
        delete newAlerts[item.id]; // remove alert when the user corrects the value
    }

    setinputValues(updatedInputValues);
    setAlerts(newAlerts);
    if (newAlerts[item.id]) {
      setTimeout(() => {
          delete newAlerts[item.id];
          setAlerts({ ...newAlerts });
      }, 3000); // 2000 milliseconds (2 seconds)
  }
};

  const handleRecipientInputChange = (event) => {
    setRecipientInput(event.target.value);
  };

  let recipientOptions = [];

  if (recipients) {
    recipientOptions = Object.keys(recipients).map((key) => (
      <option key={key} value={recipients[key].name} />
    ));
  }
  
  

  return (
    
    <div> 
    <div class="stockout-container">
        <h2>Stockout Categories</h2>
        <div class="stockout-category">
            <strong>Purple:</strong> When item end balance is less than days until next month.
        </div>
        <div class="stockout-category">
            <strong>Red:</strong> When current average is less than or equal to 50% of historical average.
        </div>
        <div class="stockout-category">
            <strong>Green:</strong> When the item's end balance is greater than or equal to the product of historical average and days until next month, or when historical average and current average are the same.
        </div>
        <div class="stockout-category">
            <strong>Orange:</strong> When current average is greater than 50% of historical average.
        </div>
    </div>




      <SwitchField
      checked={dispensing}
        helpText={dispensing ? "You are currently dispensing. Press/switch to add stock" : "You are currently adding to stock. Press/switch to dispense"}
        label={dispensing ? "Dispense": "Add to Stock"}
        onChange={switchDispenseOrAdd}
        name="switchName"
        value="defaultValue"
      />


    {dispensing && (
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

        <datalist id="recipientOptions">
          {recipientOptions}
        </datalist>

    
        <label htmlFor="department">Department:</label>
        <select
          name="department"
          value={department}
          onChange={changeDepartment}
        >
          <option value="Department 1">Department 1</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>
    )}
       
    {invalidInp && (
        <AlertBar duration={2000} onHidden={alertNegativInp}>
        Invalid input
        </AlertBar>
      )}

      {toLargeDispense && (
        <AlertBar duration={2000} onHidden={alertLargeDispense}>
        Trying to dispense more than balance
        </AlertBar>
      )}

      
      
    <Table>
      
        <TableHead>
          Days until stock in {daysUntilNextMonth}
            <TableRowHead>
            <TableCellHead>Commodities</TableCellHead>
            <TableCellHead>Balance</TableCellHead>
            <TableCellHead>Consumption</TableCellHead>
            <TableCellHead>{dispensing ? "Dispense" : "Add Stock"}</TableCellHead>
            {dispensing ?  <TableCellHead>Max recommended dispense amount</TableCellHead> :null}
            {dispensing ?  <TableCellHead>Balance Status</TableCellHead> :null}
           
            </TableRowHead>
        </TableHead>

        <TableBody>
          
            {commodityData.map((item) => {
           

              let avg =  Math.ceil(averageConsumption[item.displayName]/30); 

              let currentAvg = item.endBalance/daysUntilNextMonth  ;
              let text = Math.floor(item.endBalance/daysUntilNextMonth ) ;


              let xGreen = Math.ceil(Math.max(item.endBalance - avg * daysUntilNextMonth, 0))+1;
              let xOrange = Math.max(0, (item.endBalance - avg * daysUntilNextMonth*0.5)) || 0;




              let check ;

              //If balance gives avg lower than 50% then balance is criticaly low! we assume 
              if (item.endBalance<daysUntilNextMonth) {
                check = "purple";
              }else if (currentAvg <= (0.5 * avg)) {
                check = "red"
              }else if (avg*daysUntilNextMonth<item.endBalance ||avg == currentAvg) {
                check = "green"
              } else if (currentAvg > 0.5 * avg ) {
                check = "orange";
              }
            
          
            

            //Shows commodity data
            return (
              
              
                <TableRow key={item.id}>
                <TableCell>{item.displayName.replace('Commodities - ', '')}</TableCell>
                <TableCell>
                    {item.endBalance }
                </TableCell>
                <TableCell>
                    {item.consumption }
                </TableCell>
                <TableCell>
                    <div className="input-wrapper">
                    <input
                      name="dispense"
                      type="number"
                      min="0"
                      onChange={(e) => handleInputChange(e, item,check,xGreen,xOrange)}
                    />
                                {dispensing ?  alerts[item.id] && <span className="alert-message">{alerts[item.id]}</span>:null}

                    
                  </div>
                </TableCell>

                {dispensing ? 
                <TableCell>

                  {check === "orange" ? 
                  (

                  <span style={{ color: 'orange' }} onClick={() => showBalanceInfo(item, "Sufficient")}>
                {(xOrange - 1) <= 0 ? "No further dispenses today to prevent stockout RED" : `Caution! Max: ${Math.ceil(xOrange - 1)} today to prevent Stockout level Red`}

                  </span>

                  ) : check === "green" ? (

                      <span style={{ color: 'green' }} onClick={() => showBalanceInfo(item, "Sufficient")}>
                      {(xGreen - 1) === 0 ? "No further dispenses today to prevent stockout ORANGE" : ` Max: ${Math.ceil(xGreen - 1)} today to prevent Stockout level Orange.`}
                      </span>

                  ): check === "purple" ? (

                    <span style={{ color: 'purple' }} onClick={() => showBalanceInfo(item, "NotSufficient")}>
                    Alert! Dispense only if absolutely necessary.
                   
                    </span>
                ) : (

                      <span style={{ color: 'red' }} onClick={() => showBalanceInfo(item, "NotSufficient")}>
                      {(item.endBalance-daysUntilNextMonth) === 0 ? "No further dispenses today to prevent stockout Purple" : ` Critical! Max: ${Math.ceil(item.endBalance-daysUntilNextMonth)} today to prevent Stockout level Purple.`}

                      </span>
              )}


                </TableCell>
               
               :null}


            {dispensing ? (
              <TableCell>
                {check && (
                  <span
                    style={{ color: check === "orange" ? "orange" : check === "green" ? "green" : check === "purple" ? "purple" : "red" }}
                    onClick={() => showBalanceInfo(item, check === "orange" || check === "green" ? "Sufficient" : "NotSufficient")}
                  >
                    {check === "orange" ? "Orange" : check === "green" ? "Green" : check === "purple" ? "Purple" : "Red"}
                  </span>
                )}
              </TableCell>
            ) : null}  

                </TableRow>
            );
            })}

        </TableBody>
    </Table>

    <button onClick={showConfirmationWindow}>Update</button>
     
    {balanceInfo && (
        <BalanceInfo
        selectedCommodity={selectedCommodity}
        averageConsumption={averageConsumption[selectedCommodity.displayName]}
        status={status}
        decline={decline}
        confirm={sendToNearbyClinic}
       />
     )}

    {confirmationWindow && (
        <ConfirmationWindow
        dispensing={dispensing}
        commodityData={commodityData}
        inputValues={inputValues}
        decline={decline}
        confirm={confirm}
        averageConsumption={averageConsumption} />
     )}

    {stockOut && (
        <DispenseStockOut
        stockOut={stockOut}
        commodityData={commodityData}
        inputValues={inputValues}
        stock={stock} />
     )}

   

   

    </div>
  );
}