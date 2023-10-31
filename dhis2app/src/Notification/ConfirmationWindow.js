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

          let icon = "";
          let recommendation = "";

          if (item.endBalance - dispenseValue < daysUntilNextMonth && item.endBalance >= daysUntilNextMonth) {
            icon = "🟣"; // Red exclamation mark
            recommendation = "This will move to PURPLE";
          } else if (currentAvg <= 0.5 * avg && prevAvg > 0.5 * avg) {
            icon = "❗"; // Red exclamation mark
            recommendation = "This will move to RED";
          } else if (currentAvg > 0.5 * avg && currentAvg < avg && (prevAvg <= 0.5 * avg || prevAvg >= avg)) {
            icon = "🔶"; // Yellow exclamation mark
            recommendation = "This will move to YELLOW";
          }

          return dispenseValue > 0 ? (
            <li key={item.id}>
              <span>
                {dispensing
                  ? `${item.displayName.replace('Commodities - ', '')} - Dispense: ${dispenseValue} ${recommendation} ${icon}`
                  : `${item.displayName.replace('Commodities - ', '')} - Add: ${dispenseValue}`}
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