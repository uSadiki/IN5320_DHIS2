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
const BalanceInfo = ({ selectedCommodity,status,averageConsumption,decline, confirm }) => {
    console.log(averageConsumption)
    let dailyConsumption = Math.ceil(averageConsumption / 30);
    let commodityName = selectedCommodity.displayName.replace('Commodities - ', '');
    let today = new Date()
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(14);

    // Calculate the number of days until the 14th of the next month
    const daysUntilNextMonth = Math.ceil((nextMonth - today) / (1000 * 60 * 60 * 24));


    return (

    
    <Modal>
      <ModalTitle>{status=="NotSufficient" ? "Risk of Stock-out" : "Information about consumption"}</ModalTitle>
      <ModalContent>
      {status === "NotSufficient" ? (
        
     <p>The average daily dispense for {commodityName} is {dailyConsumption} units per day. Please exercise caution when making dispenses. <br></br>There are {daysUntilNextMonth} days until the next stock-in. </p>

            ) : (
            <p>The average daily dispense for {commodityName} is {dailyConsumption}.</p>
        )}       
      </ModalContent>
      <ModalActions>
      
            {status === "NotSufficient" ? (
            <Button primary onClick={confirm}>
                Check nearby Clinics
            </Button>
            ) : (
            <Button primary onClick={decline}>
                I understand
            </Button>
            )}
            {status === "NotSufficient" && (
            <Button secondary onClick={decline}>
                I understand
            </Button>
            )}
        
        </ModalActions>
    </Modal>
       
  );
};

export default BalanceInfo; 