import React, { useState } from "react";
import classes from "./App.module.css";
import { StartIt } from "./StartIt";
import { Navigation } from "./Navigation";
import { Analysis_dashboard } from "./Analysis_dashboard";
import { DataManagement } from "./DataManagement";
import { CorrectData } from "./CorrectData";
import { NearByUnits } from "./NearByUnits";

function MyApp() {

  //State, hold current page, orgUnit and the data
  const [activePage, setActivePage] = useState("Dashboard");
  const [activeOrgUnit, setActiveOrgUnit] = useState("FNnj3jKGS7i");
  const [activeOrgUnitName, setActiveOrgUnitName] = useState("Bandajuma Clinic CHC");
  const [commodityData, setCommodityData] = useState([]);
  const [activeOrgUnitParent, setActiveOrgUnitParent] = useState("NqWaKXcg01b");
  const [{activeOrgUnitNameParent}, setActiveOrgUnitNameParent] = useState("Sowa");

  //Set method for active page
  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    
     //Site content, depending on which is the active page, different data are being sent as props and data is shown
    <div className={classes.container}>

      <div className={classes.left}>
        <Navigation activePage={activePage} activePageHandler={activePageHandler} />
      </div>
  
    
      <div className={classes.right}>

       {activeOrgUnitName === "" ? null : <h1>Current Clinic: {activeOrgUnitName}</h1>}

       {activePage === "UpdateData" && <DataManagement 
                                           orgUnit={activeOrgUnit} 
                                           commodityData={commodityData}  
                                           setActivePage={setActivePage} />}

       {activePage === "DataCorrection" && <CorrectData 
                                                   orgUnit={activeOrgUnit} 
                                                   commodityData={commodityData} 
                                                   setActivePage={setActivePage} />}
       
       
       {activePage === "Dashboard" &&  <Analysis_dashboard 
                                                        orgUnit={activeOrgUnit} 
                                                        setCommodityData={setCommodityData}
                                                        commodityData={commodityData} 
                                                        setActivePage={setActivePage} />}


        
       {activePage === "StartIt" &&  <StartIt  //WILL BE REMOVED
                                              setActivePage={setActivePage} 
                                              setActiveOrgUnit={setActiveOrgUnit}
                                              setActiveOrgUnitName={setActiveOrgUnitName}
                                              activeOrgUnitParent ={activeOrgUnitParent}
                                              activeOrgUnitNameParent={activeOrgUnitNameParent} />}
                                              

        {activePage === "NearbyUnits" &&  <NearByUnits 
                                                       setActivePage={setActivePage} 
                                                       setActiveOrgUnit={setActiveOrgUnit}
                                                       setActiveOrgUnitName={setActiveOrgUnitName}
                                                       activeOrgUnitParent ={activeOrgUnitParent}
                                                       activeOrgUnitNameParent={activeOrgUnitNameParent}  />}
      
      </div>
    </div>
  );

}

export default MyApp;
