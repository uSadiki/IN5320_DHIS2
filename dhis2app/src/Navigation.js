import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  const menuItems = [
    { label: "Dashboard", page: "Dashboard" },
    { label: "Dispense/Stock up", page: "UpdateData" },
    { label: "Nearby Units", page: "NearbyUnits" },
    { label: "History", page: "History" },
    { label: "Stock Recount", page: "StockRecount" },
    { label: "Stock Correction", page: "DataCorrection" }
  ];

  const handleClick = page => {
    props.activePageHandler(page);
  };

  return (
    <Menu>
      {menuItems.map(item => (
        <MenuItem
          key={item.page}
          label={item.label}
          active={props.activePage === item.page}
          onClick={() => handleClick(item.page)}
        />
      ))}
    </Menu>
  );
}