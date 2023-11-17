import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";
import Dashboard from "./Images/dashboard.png"
import Dispense from "./Images/dispense.png"
import Nearby from "./Images/nearby.png"
import History from "./Images/history.png"
import Recount from "./Images/recount.png"




export function Navigation(props) {
  const menuItems = [
    { label: "Dashboard", page: "Dashboard", pic: Dashboard },
    { label: "Dispense/Stock up", page: "UpdateData", pic: Dispense },
    { label: "Nearby Units", page: "NearbyUnits", pic: Nearby },
    { label: "History", page: "History", pic: History },
    { label: "Stock Recount", page: "StockRecount", pic: Recount },
  ];

  const handleClick = page => {
    props.activePageHandler(page);
  };

  return (
    <Menu>
      {menuItems.map(item => (
        <div key={item.page} className="menu" onClick={() => handleClick(item.page)}>
            <MenuItem
              label={item.label}
              active={props.activePage === item.page}
              icon = {<img src= {item.pic} alt={item.label} className="navPic"/>}
              />
        </div>
      ))}
    </Menu>
  );
}