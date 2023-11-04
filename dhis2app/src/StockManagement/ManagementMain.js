import React, { useState } from 'react';
import { useMutation } from '../DataHandlingHelper/DataMutation'; 
import DispenseStockOut from '../Notification/DispenseStockOut';
import ConfirmationWindow from '../Notification/ConfirmationWindow';
import BalanceInfo from '../Notification/BalanceInfo';
import { UpdateConfirmLogic } from './UpdateConfirmLogic';
import * as CommonUtils from '../CommonUtils';
import { getData } from '../DataStoreUtils/DatastorePull';
import { Table, TableBody, TableCellHead, TableHead, TableRowHead, AlertBar, SwitchField } from '@dhis2/ui'
import '../Css/CssTest.css';
import {DataBody} from'./VisualContent/Databody'
import RecipientForm from './VisualContent/RecipientForm';


//TODO: Find a name for representing dispense and add to stock
export function ManagementMain({ orgUnit, commodityData,setActivePage ,averageConsumption,username}) {
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
  const handleInputChange = (event, item) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[item.id] = event.target.value;
    setinputValues(updatedInputValues);
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
    <div className="stockout-container">
        <h2>Stockout Categories</h2>
        <div className="stockout-category">
            <strong>Purple:</strong> When item end balance is less than days until next month.
        </div>
        <div className="stockout-category">
            <strong>Red:</strong> When current average is less than or equal to 50% of historical average.
        </div>
        <div className="stockout-category">
            <strong>Green:</strong> When the item's end balance is greater than or equal to the product of historical average and days until next month, or when historical average and current average are the same.
        </div>
        <div className="stockout-category">
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


     <RecipientForm
        dispensing={dispensing}
        recipientInput={recipientInput}
        handleRecipientInputChange={handleRecipientInputChange}
        recipientOptions={recipientOptions}
        department={department}
        changeDepartment={changeDepartment}
        departments={departments} />
       
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

      
Days until stock in {daysUntilNextMonth}
    <Table>
      
        <TableHead>
        
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
                <DataBody
                    commodityData={commodityData}
                    averageConsumption={averageConsumption}
                    handleInputChange={handleInputChange}
                    daysUntilNextMonth={daysUntilNextMonth}
                    dispensing={dispensing}
                    showBalanceInfo={showBalanceInfo}
                    
                    />
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