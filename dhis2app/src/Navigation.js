import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";
import Dashboard from "./images/dashboard.png"
import Dispense from "./images/dispense.png"
import Nearby from "./images/nearby.png"
import History from "./images/history.png"
import Recount from "./images/recount.png"




export function Navigation(props) {
  const menuItems = [
    { label: "Dashboard", page: "Dashboard", pic: Dashboard },
    { label: "Dispense/Stock up", page: "UpdateData", pic: Dispense },
    { label: "Nearby Units", page: "NearbyUnits", pic: Nearby },
    { label: "History", page: "History", pic: History },
    { label: "Stock Recount", page: "StockRecount", pic: Recount },
    { label: "Stock Correction", page: "DataCorrection", pic: Recount}
  ];

  const handleClick = page => {
    props.activePageHandler(page);
  };

  return (
    <Menu>
      {menuItems.map(item => (
        <div className="menu" onClick={() => handleClick(item.page)}>
            <MenuItem
              key={item.page}
              label={item.label}
              active={props.activePage === item.page}
              icon = {<img src= {item.pic} alt={item.label} className="navPic"/>}
            />
        </div>
      ))}
    </Menu>
  );
}