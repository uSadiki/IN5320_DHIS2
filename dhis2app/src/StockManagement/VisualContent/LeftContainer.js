// LeftContainer.js

import React from 'react';
import { Table, TableBody, TableCellHead, TableHead, TableRowHead, AlertBar, SwitchField, InputField,SegmentedControl } from '@dhis2/ui'
import {DataBody} from'./Databody'
import Tooltip from './Tooltip'; // Adjust the import path based on your project structure
import '../../Css/dataMan.css';
import Info from '../../Images/info.png';


const LeftContainer = ({
 

  searchInput,
          handleSearchChange,
          averageConsumption,
          handleInputChange,
          daysUntilNextMonth,
          dispensing,
          showBalanceInfo,
          inputValues,
          showTooltip,
          setShowTooltip,
          filteredCommodities
}) => {
  return (
    <div id="left-container">

    <InputField
            type="text"
            id="search"
            label="Search Commodities"
            placeholder="Type to search..."
            value={searchInput}
            onChange={(value) => handleSearchChange(value)}
          />
      
    <Table>
          
          <TableHead>
          
              <TableRowHead>
              <TableCellHead>Commodities</TableCellHead>
              <TableCellHead>Balance</TableCellHead>
              <TableCellHead>Consumption</TableCellHead>
              <TableCellHead>{dispensing ? "Dispense" : "Add Stock"}</TableCellHead>      

              {dispensing ? (
                <TableCellHead>
                  Status
                  <img
                    className="info-icon"
                    src={Info}
                    alt="Info Icon"
                    onClick={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && <Tooltip />}
                </TableCellHead>
              ) : null}


            
              </TableRowHead>
          </TableHead>

          <TableBody>
                  <DataBody
                      commodityData={filteredCommodities}
                      averageConsumption={averageConsumption}
                      handleInputChange={handleInputChange}
                      daysUntilNextMonth={daysUntilNextMonth}
                      dispensing={dispensing}
                      showBalanceInfo={showBalanceInfo}
                      inputValues={inputValues}
                      
                      />
          </TableBody>

    </Table>
          
    </div>
  );
};


export default LeftContainer;
