import React from "react";
import classes from "./App.module.css";
import { useState } from "react";
import { Browse } from "./Browse";
import { StartIt } from "./StartIt";
import { Insert } from "./Insert";
import { Datasets } from "./Datasets";
import { Navigation } from "./Navigation";

import { Analysis_dashboard } from "./Analysis_dashboard";


function MyApp() {
  const [activePage, setActivePage] = useState("StartIt");
  const [activeOrgUnit, setActiveOrgUnit] = useState("");


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
          <Browse orgUnit={activeOrgUnit} />
        ) : null}
  
        {activePage === "Insert" && <Insert orgUnit={activeOrgUnit} />}
        {activePage === "Datasets" && <Datasets />}
      </div>
    </div>
  );

}

export default MyApp;
