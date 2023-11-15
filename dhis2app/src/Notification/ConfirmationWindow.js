import React from 'react';
import {calculateDaysUntilNextMonth} from '../CommonUtils'

  import { 
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button
  } from '@dhis2/ui'

//This method will present a confirmation window for wanted dispenses/stockIns.
const ConfirmationWindow = ({ dispensing, commodityData, inputValues, decline, confirm ,averageConsumption}) => {
  let daysUntilNextMonth = calculateDaysUntilNextMonth();

  

  return (
    <>
    <Modal>
      <ModalTitle>{dispensing ? "Confirm dispense" : "Confirm Add to Stock"}</ModalTitle>
      <ModalContent>
        <p>Commodities about to be {dispensing ? "Dispensed" : "Added to Stock"}:</p>

        <ul>
        {commodityData.map((item) => {

          const dispenseValue = parseInt(inputValues[item.id]) || 0;
         
         
          const avg = Math.ceil(averageConsumption[item.displayName] / 30);
          const currentAvg = (item.endBalance - dispenseValue) / daysUntilNextMonth;
          const prevAvg = item.endBalance / daysUntilNextMonth;

          let xGreen = Math.ceil(Math.max(item.endBalance - avg * daysUntilNextMonth, 0))+1;
          let xOrange = Math.max(0, (item.endBalance- avg*daysUntilNextMonth*0.5 )) || 0;

          let icon = "";
          let recommendation = "";


          if (currentAvg <= 0.5 * avg && prevAvg > 0.5 * avg) {
            icon = "❗"; 
            recommendation = "Max recommended : "+ (xOrange - 1);
          } else if (currentAvg > 0.5 * avg && currentAvg < avg && (prevAvg <= 0.5 * avg || prevAvg >= avg)) {
            icon = "❗"; 
            recommendation = "Max recommended : "+ (xGreen - 1);
          }

          return dispenseValue > 0 ? (
            <li key={item.id}>
              <span>
                {dispensing
                  ? `${item.displayName.replace('Commodities - ', '')} : ${dispenseValue} units  ${icon} ${recommendation} ${icon}`
                  : `${item.displayName.replace('Commodities - ', '')} : ${dispenseValue} units`}
              </span>
            </li>
          ) : null;
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