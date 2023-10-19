import React, { useState } from "react";
import classes from "./App.module.css";
import { Browse } from "./Browse";
import { StartIt } from "./StartIt";
import { Insert } from "./Insert";
import { Datasets } from "./Datasets";
import { Navigation } from "./Navigation";
import { UpdateStock } from "./UpdateStock";

import { Analysis_dashboard } from "./Analysis_dashboard";


function MyApp() {
  const [activePage, setActivePage] = useState("StartIt");
  const [activeOrgUnit, setActiveOrgUnit] = useState("");
  const [mergedData, setMergedData] = useState([]);


  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
  
      <div className={classes.right}>
        {activePage === "StartIt" ? (
          <StartIt
            setActivePage={setActivePage}
            setActiveOrgUnit={setActiveOrgUnit}
          />
        ) : activePage === "Browse" ? (
          <div>
            <Analysis_dashboard
              orgUnit={activeOrgUnit}
              setMergedData={setMergedData}
              mergedData2={mergedData}
              setActivePage={setActivePage}
            />

           

          </div>
        ) : null}

  
  {activePage === "Insert" && <Insert orgUnit={activeOrgUnit} mergedDataInput={mergedData}  setActivePage={setActivePage} />}
  
  {activePage === "UpdateStock" && <UpdateStock orgUnit={activeOrgUnit} mergedDataInput={mergedData} />}
        
      </div>
    </div>
  );

}

export default MyApp;
