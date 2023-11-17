import React from 'react';
import {TableCell, TableRow} from '@dhis2/ui'

export function DataBody({ commodityData,averageConsumption,handleInputChange,daysUntilNextMonth,dispensing,showBalanceInfo,inputValues}) {

    return (
        <React.Fragment>
    {commodityData.map((item) => {
           
        let avg =  Math.ceil(averageConsumption[item.displayName]/30); 
        let currentAvg = item.endBalance/daysUntilNextMonth  ;
        let check ;

        //If balance gives avg lower than 50% then balance is criticaly low! 
        if (currentAvg <= (0.5 * avg)) {
          check = "red"
        }else if (avg*daysUntilNextMonth<item.endBalance ||avg == currentAvg) {
          check = "green"
        } else if (currentAvg > 0.5 * avg ) {
          check = "orange";
        }
      

        // Determine if there's input in the row
        const hasInput = inputValues[item.id] !== undefined && inputValues[item.id] !== '' && inputValues[item.id] >0;

      //Shows commodity data
      return (
        
  <TableRow key={item.id} className={`zebraStriping ${hasInput ? 'highlighted-row' : ''}`}>
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
                  onChange={(e) => handleInputChange(e, item)}
                />    
            </div>
          </TableCell>

          {dispensing ? (
              <TableCell>
                {check && (
                  <span
                    className={`balance-status-span ${check}`}
                    onClick={() => showBalanceInfo(item, check === "orange" || check === "green" ? "Sufficient" : "NotSufficient")}
                  >
                    {check === "orange" ? "Moderate" : check === "green" ? "Healthy" : "Critical"}
                  </span>
                )}
              </TableCell>
            ) : null}

          </TableRow>
      );
      })}

</React.Fragment>
  );

}