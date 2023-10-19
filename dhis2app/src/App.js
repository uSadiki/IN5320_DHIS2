import React, { useState } from "react";
import classes from "./App.module.css";
import { StartIt } from "./StartIt";
import { Insert } from "./Insert";
import { Navigation } from "./Navigation";
import { UpdateStock } from "./UpdateStock";
import { Analysis_dashboard } from "./Analysis_dashboard";
import { Browse } from "./Browse";
import { Datasets } from "./Datasets";

function MyApp() {

  //State, hold current page, orgUnit and the data
  const [activePage, setActivePage] = useState("StartIt");
  const [activeOrgUnit, setActiveOrgUnit] = useState("");
  const [activeOrgUnitName, setActiveOrgUnitName] = useState("");
  const [commodityData, setCommodityData] = useState([]);

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

       {activePage === "Insert" && <Insert 
                                           orgUnit={activeOrgUnit} 
                                           commodityData={commodityData}  
                                           setActivePage={setActivePage} />}

       {activePage === "StartIt" &&  <StartIt 
                                              setActivePage={setActivePage} 
                                              setActiveOrgUnit={setActiveOrgUnit}
                                              setActiveOrgUnitName={setActiveOrgUnitName} />}

      {activePage === "UpdateStock" && <UpdateStock 
                                                   orgUnit={activeOrgUnit} 
                                                   commodityData={commodityData} />}
       

       {activePage === "Browse" &&  <Analysis_dashboard 
                                                        orgUnit={activeOrgUnit} 
                                                        setCommodityData={setCommodityData}
                                                        commodityData={commodityData} 
                                                        setActivePage={setActivePage} />}
      
      </div>
    </div>
  );

}

export default MyApp;
