import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { CircularLoader,} from '@dhis2/ui';
import * as CommonUtils from '../CommonUtils';
import {Button, InputField} from '@dhis2/ui';
import calculateAverageConsumption from './HelperMethods/CalculateAverageConsumption';
import CommoditiesTable from './ComponentsDashboard/CommoditiesTable'
import '../Css/Dashboard.css';
import StoreManager from '../images/StoreManager.jpeg';



 //Query to get commodity data
 const dataQuery = {
    dataValues: {
        resource: "/dataValueSets",

        params: ({ orgUnit }) => ({
            orgUnit,
            period: CommonUtils.getFormattedDate()+",202309,202308",
            dataSet: 'ULowA8V3ucd',
            fields: ['id'],
          }),
      
    },
    dataElements: {
        resource: "/dataElements",
        params: {
            fields: ["id", "displayName","period"],
            filter: "displayName:like:Commodities",
        },
    },
};


export function Analysis_dashboard({ orgUnit, setCommodityData, commodityData,setActivePage,setAverageConsumption,name, averageConsumption }) {

    const { loading, error, data } = useDataQuery(dataQuery, {
        variables: {
          orgUnit,
        },
      });

    // Using useEffect since without it would render for each commodity found..
    useEffect(() => {
        
        //Here we store data in an array that holds a dict, easier for access and will set state value for final commodity data
        if (data) {
            let array = [];

            const mergedData = CommonUtils.mergeData(data);
            console.log(mergedData)
            setAverageConsumption(calculateAverageConsumption(data, "rQLFnNXXIL0", ["202308", "202309"]));

            mergedData.map(row => {
                array.push({
                    id: row.id,
                    displayName: row.displayName,
                    administered: row.values["HllvX50cXC0"],
                    endBalance: row.values["J2Qf1jtZuj8"],
                    consumption: row.values["rQLFnNXXIL0"],
                    quantityToBeOrdered: row.values["KPP63zJPkOu"]
                });
             
            });

            setCommodityData(array);
        }
    }, [data]);


    let daysUntilNextMonth = CommonUtils.calculateDaysUntilNextMonth();
    //search filter state
    const [searchInput, setSearchInput] = useState('');

    //filter commodities
    const filteredCommodities = commodityData.filter(item =>
        item.displayName.toLowerCase().startsWith(`commodities - ${searchInput.toLowerCase()}`)
    );
    

    const handleSearchChange = (event) => {
        setSearchInput(event.value);
    };

    function sendToNearbyClinic(){
      setActivePage("NearbyUnits")
    }
  
    //Error handling
    if (error) {
        return <span>ERROR: {error.message}</span>;
    }

    //Loading handling
    if (loading) {
        return <CircularLoader large />;
    }
    
    return (
        <div>
         <div className="boxes-container">
          <div className="box" id="leftbox">
            <h2>Welcome {name.split(' ')[0]}</h2>
          
            <img src={StoreManager} alt="Store Manager" />
            Have a nice day at work!

          </div>

          <div className="box" id="middlebox">
            <h2>Days until restock</h2>
          
            <p >{daysUntilNextMonth}</p>

          </div>

          <div className="box" id="rightbox">
            <h2>Critical low stock on:</h2>
            <ul className="risk-list">
            {commodityData.map((item) => {
              let daysUntilNextMonth = CommonUtils.calculateDaysUntilNextMonth();
              let avg = Math.ceil(averageConsumption[item.displayName] / 30);
              let currentAvg = item.endBalance / daysUntilNextMonth;
              let check;

              // If balance gives avg lower than 50%, then the balance is critically low!
              if (currentAvg <= 0.5 * avg) {
                check = "red";

                // Display items with red check
                return (
                  <li key={item.id} className="risk-item">
            <span className="risk-indicator">&#9888;</span> {item.displayName.replace('Commodities - ', '')}
                  </li>
                );
              }

              // Return null for items that don't meet the criteria
              return null;
            })}
          </ul>

          <div className="button-container">
            <Button primary onClick={sendToNearbyClinic}>
              Check nearby units
            </Button>
          </div>


      </div>
    </div>
            
            <InputField
            type="text"
            id="search"
            label="Search Commodities"
            placeholder="Type to search..."
            value={searchInput}
            onChange={(value) => handleSearchChange(value)}
            />

            <CommoditiesTable filteredCommodities={filteredCommodities} />


        </div>
    );
}
