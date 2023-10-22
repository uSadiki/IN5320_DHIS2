import React from 'react'
import { useState, useEffect } from 'react';

import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import "./start.css"; // Import the CSS file



import {
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'



const OrgUnitQuery = {
    orgUnits: {
        resource: "/organisationUnits",
        params: {
        fields: "id,name",
        filter: "parent.id:eq:NqWaKXcg01b"
        }
    }
  }

export function NearByUnits(props) {
  const { loading, error, data } = useDataQuery(OrgUnitQuery)

  console.log("API response:")
  

  if (loading) return <CircularLoader />
  if (error) return <span>ERROR: {error.message}</span>
  if (data) {
    const organizationUnits = data.orgUnits.organisationUnits;

    console.log("API response:",data)
    return  (




        <div className="table-container" style={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
         <div className="header">
            {/* Your header content */}
        </div>

        <div className="content" style={{ display: 'flex', flexWrap: 'wrap' }}>

        
        {organizationUnits.map(({ id, name }) => (
            
            <div
            className="menu-item"
            key={id}
            style={{
              flex: '1 0 30%',
              border: '1px solid gray',
              margin: '10px',
              padding: '10px'
            }}
            onClick={() => handleClickForData(id)}
          >
            {name}
          </div>
                        ))}

        </div>

        </div>





    )



};

}

