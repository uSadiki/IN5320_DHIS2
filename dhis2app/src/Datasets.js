import React from "react";
import { useState, useEffect } from "react";
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import { Menu, MenuItem } from "@dhis2/ui"

import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
} from '@dhis2/ui'

const request = {
  request0: {
    resource: "dataSets",
    params: {
      fields: "id,displayName,created",
      paging: "false"
    }
  }
}


export function Datasets() {
    const [datasetState, setDataset] = useState();

    const onChange = (event) => {
      setDataset(event);
    };

    const showDatasetInfo = (dataset) => {
      if (!dataset) {
        return null;
      }
      
      return (
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Display Name</TableCellHead>
              <TableCellHead>created</TableCellHead>
              <TableCellHead>ID</TableCellHead>
            </TableRowHead>
          </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{datasetState.displayName}</TableCell>
                <TableCell>{datasetState.created}</TableCell>
                <TableCell>{datasetState.id}</TableCell>
              </TableRow>
            </TableBody>
        </Table>
      );
    };
  
    const { loading, error, data } = useDataQuery(request)
    if (error) {
        return <span>ERROR: {error.message}</span>
    }

    if (loading) {
      return <CircularLoader large />
    }

    if (data) {
      console.log("data stuff here")
      console.log(data)
      let dataSet = data.request0.dataSets
      return (
        <div style={{display: "flex"}}>
        <Menu>
        {dataSet.map(dataSet => (
          <MenuItem key={dataSet.id} label={dataSet.displayName} onClick={() => onChange(dataSet)}/>
        ))}
        </Menu>

          {datasetState && (
            <div>
              {showDatasetInfo(datasetState)}
            </div>
          )}
        </div>
        ) 
    }    
}