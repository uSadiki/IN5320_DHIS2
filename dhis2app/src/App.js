import React, { useState } from "react";
import classes from "./App.module.css";
import { Navigation } from "./Navigation";
import { Analysis_dashboard } from "./Dashboard/Analysis_dashboard";
import { ManagementMain } from "./StockManagement/ManagementMain";
import { CorrectData } from "./DataCorrection/CorrectData";
import { NearByUnits } from "./NearByUnits/NearByUnits";
import { History }  from "./LogedData/History"; 
import * as CommonUtils from './CommonUtils';
import { RecountMain } from './Recount/RecountMain';  

function MyApp() {

  //State, hold current page, orgUnit and the data
  const [activePage, setActivePage] = useState("Dashboard");
  const [activeOrgUnit, setActiveOrgUnit] = useState("FNnj3jKGS7i");
  const [activeOrgUnitName, setActiveOrgUnitName] = useState("Bandajuma Clinic CHC");
  const [commodityData, setCommodityData] = useState([]);
  const [activeOrgUnitParent, setActiveOrgUnitParent] = useState("NqWaKXcg01b");
  const [activeOrgUnitNameParent, setActiveOrgUnitNameParent] = useState("Sowa");
  const [averageConsumption, setAverageConsumption] = useState();

  //Set method for active page
  function activePageHandler(page) {
    setActivePage(page);
  }
  
  const name = CommonUtils.getUserName()

  return (
    
    
     //Site content, depending on which is the active page, different data are being sent as props and data is shown
    <div className={classes.container}>


      
      <div className={classes.left}>
        <Navigation activePage={activePage} activePageHandler={activePageHandler} />
      </div>
  
    
      <div className={classes.right}>

       {activePage === "UpdateData" && <ManagementMain 
                                           orgUnit={activeOrgUnit} 
                                           commodityData={commodityData}  
                                           setActivePage={setActivePage} 
                                           averageConsumption={averageConsumption}
                                           username={name}/>}
     
       {activePage === "DataCorrection" && <CorrectData 
                                                   orgUnit={activeOrgUnit} 
                                                   commodityData={commodityData} 
                                                   setActivePage={setActivePage}
                                                  
                                                  />}
    
       {activePage === "Dashboard" &&  <Analysis_dashboard 
                                                        orgUnit={activeOrgUnit} 
                                                        setCommodityData={setCommodityData}
                                                        commodityData={commodityData} 
                                                        setActivePage={setActivePage}
                                                        setAverageConsumption={setAverageConsumption} />}
                                                    
        
        {activePage === "StockRecount" && <RecountMain 
                                                   orgUnit={activeOrgUnit} 
                                                   commodityData={commodityData} 
                                                   user = {name}
                                                    />}     

        
    
                                              

        {activePage === "NearbyUnits" &&  <NearByUnits />}
        {activePage === "History" &&  <History/>}
                                                    
        
       
                                                                                        

                                                        
            
      
      </div>
    </div>
  );

}

export default MyApp;
