import React, { useState } from 'react';
import { useMutation } from '../DataHandlingHelper/DataMutation'; 
import DispenseStockOut from '../ModalWindows/DispenseStockOut';
import ConfirmationWindow from '../ModalWindows/ConfirmationWindow';
import BalanceInfo from '../ModalWindows/BalanceInfo';
import { UpdateConfirmLogic } from './UpdateConfirmLogic';
import * as CommonUtils from '../CommonUtils';
import { getData } from '../DataStoreUtils/DatastorePull';
import {AlertBar} from '@dhis2/ui'
import '../Css/ManagementMain.css';
import LeftContainer from './VisualContent/LeftContainer'; // Adjust the import path based on your project structure
import RightContainer from './VisualContent/RightContainer';


//TODO: Find a name for representing dispense and add to stock
export function ManagementMain({ orgUnit, commodityData,setActivePage ,averageConsumption,username}) {
  //    !!!    STATE declaration    !!!
  const { updateEndBalance, updateConsumption,updateAdministered, pushTransaction, pushRecipients } = useMutation();

  //search filter state
  const [searchInput, setSearchInput] = useState('');

  //state with dict of all input values (key=id, value=input)
  const [inputValues, setinputValues] = useState({});

  const [confirmationWindow, setConfirmationWindow] = useState(false);

  //check if dispense > end balance: true if so
  const [stockOut, setStockOut] = useState(false);
  //state for invalid input
  const [invalidInp, setInvalidInp] = useState(false);
  //state for empty recipient or not choosen department
  const [missingInfo, setMissingInfo] = useState(false);
  //switch between dispense and add
  const [dispensing, setDispensing] = useState(true);

  const [department, setDepartment] = useState("Select departmenst");

  const departments = ['Department 1' ,'Department 2', 'Department 3'];

  const [hasDepartment, setHasDepartment] = useState(false);

  
  const [recipientInput, setRecipientInput] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);


  let transactions = getData("Transactions");
  let recipients = getData("Recipients");

  //New ones for prediction
  let daysUntilNextMonth = CommonUtils.calculateDaysUntilNextMonth();

  const [balanceInfo, setBalanceInfo] = useState(false);
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [status, setStatus] = useState(null);

  const confirm = () => {
    let period =  CommonUtils.getDateAndTime();
    UpdateConfirmLogic(commodityData, inputValues, recipientInput , dispensing, setStockOut, updateEndBalance, updateConsumption, updateAdministered, orgUnit, setConfirmationWindow, username, transactions, pushTransaction, period, recipients, pushRecipients, department,setActivePage);
    };

  //called when pressing update, checks for valid input and calls/shows the confirmation window if success
  function showConfirmationWindow(){
  

    if (dispensing && department === "Select department"){
      setMissingInfo(true);
      return;
    }
    if (dispensing && recipientInput === ""){
      setMissingInfo(true);
      return;
    }
    console.log(inputValues)
 

    const hasNonEmptyValue = Object.values(inputValues).some(value => value !== "");

    if (Object.keys(inputValues).length === 0 || !hasNonEmptyValue) {
        setInvalidInp(true);
        return;
    }

    let negativeInp = false
    let moredispense = false

    //check if all input are positive
    commodityData.forEach((item) => {
       const dispenseInput = inputValues[item.id];
       
       
      if (Number(dispenseInput) <= 0 && dispenseInput !== ""){
        negativeInp = true;
      }
     
    });
    if (negativeInp === false &&  moredispense === false){
      setConfirmationWindow(true);
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
  function sendToNearby(){
    setStockOut(false)
    setActivePage("NearbyUnits")
  }

  //Removes alert
  function close(){
    setStockOut(false)
   
  }
  //remove invalid inp alert
  function alertNegativInp(){
    setInvalidInp(false);
    setMissingInfo(false);
  }
  //Department change
  const changeDepartment = (event) => {
    setDepartment(event.target.value);
  };

  //Handling onchange data for inputs
  const handleInputChange = (event, item) => {
    const updatedInputValues = { ...inputValues };
    updatedInputValues[item.id] = event.target.value;
    setinputValues(updatedInputValues);
};
  //Recipient change
  const handleRecipientInputChange = (event) => {
    const recipientName = event.target.value;
    setRecipientInput(recipientName);
    setDepartmentForRecipient(recipientName);
  };

  let recipientOptions = [];
  if (recipients) {
    recipientOptions = Object.keys(recipients).map((key) => (
      <option key={key} value={recipients[key].name} />
    ));
  }

  //Find the department of existing recipient
  const setDepartmentForRecipient = (recipientName) => {
    setHasDepartment(false);
    let department = "Select department";
    for (const recipientKey in recipients) {
      if (recipients[recipientKey].name === recipientName) {
        department = recipients[recipientKey].department;
        setHasDepartment(true);
        break;
      }
    }
    setDepartment(department);
  };

  //filter commodities
  const filteredCommodities = commodityData.filter(item =>
    item.displayName.toLowerCase().startsWith(`commodities - ${searchInput.toLowerCase()}`)
  );

  const handleSearchChange = (event) => {
    setSearchInput(event.value);
  };

  return (
    <div> 
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
        close={close}
        sendToNearby={sendToNearby}
      />
     )}
     
      
     <h1 className="page-title">Inventory Management System: {dispensing ? 'Dispensing' : 'Adding stock'} </h1>
      
     {invalidInp && (
        <AlertBar className="alert-bar invalid-input" duration={2000} onHidden={alertNegativInp}>
          Invalid input
        </AlertBar>
      )}

      {missingInfo && (
        <AlertBar className="alert-bar missing-info" duration={2000} onHidden={alertNegativInp}>
          Invalid: choose recipient and department
        </AlertBar>
      )}

    <div id="container">

        <LeftContainer
          searchInput={searchInput}
          handleSearchChange={handleSearchChange}
          averageConsumption={averageConsumption}
          handleInputChange={handleInputChange}
          daysUntilNextMonth={daysUntilNextMonth}
          dispensing={dispensing}
          showBalanceInfo={showBalanceInfo}
          inputValues={inputValues}
          showTooltip={showTooltip}
          setShowTooltip={setShowTooltip}
          filteredCommodities={filteredCommodities}
          
        />

      <RightContainer
          setDispensing={setDispensing}
          recipientInput={recipientInput}
          handleRecipientInputChange={handleRecipientInputChange}
          recipientOptions={recipientOptions}
          department={department}
          changeDepartment={changeDepartment}
          departments={departments}
          hasDepartment={hasDepartment}
          dispensing={dispensing}
          showConfirmationWindow={showConfirmationWindow}
         
        />
       
   

  </div>
 
  </div>
  );
}