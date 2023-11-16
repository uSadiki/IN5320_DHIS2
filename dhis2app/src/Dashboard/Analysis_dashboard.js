import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import { CircularLoader,} from '@dhis2/ui';
import * as CommonUtils from '../CommonUtils';
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead, InputField} from '@dhis2/ui';
import calculateAverageConsumption from './HelperMethods/CalculateAverageConsumption';
import CommoditiesTable from './ComponentsDashboard/CommoditiesTable'
import '../Css/Dashboard.css';
import StoreManager from '../Images/StoreManager.jpeg';


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


export function Analysis_dashboard({ orgUnit, setCommodityData, commodityData,setAverageConsumption,name, averageConsumption }) {

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


    //search filter state
    const [searchInput, setSearchInput] = useState('');

    //filter commodities
    const filteredCommodities = commodityData.filter(item =>
        item.displayName.toLowerCase().startsWith(`commodities - ${searchInput.toLowerCase()}`)
    );
    

    const handleSearchChange = (event) => {
        setSearchInput(event.value);
    };

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
       
        <p >{CommonUtils.calculateDaysUntilNextMonth()}</p>

      </div>

      <div className="box" id="rightbox">
        <h2>Commodities with high risk</h2>
        <React.Fragment>
  {commodityData.map((item) => {
    let daysUntilNextMonth = CommonUtils.calculateDaysUntilNextMonth();
    let avg = Math.ceil(averageConsumption[item.displayName] / 30);
    let currentAvg = item.endBalance / daysUntilNextMonth;
    let check;

    // If balance gives avg lower than 50% then balance is critically low!
    if (currentAvg <= 0.5 * avg) {
      check = "red";
    } else if (avg * daysUntilNextMonth <= item.endBalance || avg === currentAvg) {
      check = "green";
    } else if (currentAvg > 0.5 * avg) {
      check = "yellow";
    }

    // Display items with red or orange check
    if (check === "red" || check === "yellow") {
      return (
        <div key={item.id}>
          <p>Display Name: {item.displayName}</p>
          <p>Check: {check}</p>
        </div>
      );
    }

    // Return null for items that don't meet the criteria
    return null;
  })}
</React.Fragment>
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
