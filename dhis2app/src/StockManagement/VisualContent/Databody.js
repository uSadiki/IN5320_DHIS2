import React from 'react';
import {TableCell, TableRow} from '@dhis2/ui'
import '../../Css/CssTest.css';

export function DataBody({ commodityData,averageConsumption,handleInputChange,daysUntilNextMonth,dispensing,showBalanceInfo}) {

    return (
        <React.Fragment>
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



</React.Fragment>
  );

}