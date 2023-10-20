import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Dashboard"
        active={props.activePage == "Dashboard"}
        onClick={() => props.activePageHandler("Dashboard")}
      />
      <MenuItem
        label="Dispense/Stock up"
        active={props.activePage == "UpdateData"}
        onClick={() => props.activePageHandler("UpdateData")}
      />
      <MenuItem
        label="Stock Correction"
        active={props.activePage == "DataCorrection"}
        onClick={() => props.activePageHandler("DataCorrection")}
      />
    </Menu>
  );
}
