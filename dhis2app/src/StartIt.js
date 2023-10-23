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
        fields: ['id', 'displayName'],
        paging: "false",
      },
    }
  }

export function StartIt(props) {
  const { loading, error, data } = useDataQuery(OrgUnitQuery)

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUnits, setFilteredUnits] = useState([]);

  

   // This effect runs when the data changes
   useEffect(() => {
    if(data) {
      setFilteredUnits(data.orgUnits.organisationUnits);
    }
  }, [data]);

  // This effect runs when the searchQuery changes
    useEffect(() => {
    if(data) {
      //Finds units that starts with the same you are searching for
      const filtered = data.orgUnits.organisationUnits.filter(unit => 
        unit.displayName && unit.displayName.toLowerCase().startsWith(searchQuery.toLowerCase())

      );
      setFilteredUnits(filtered);
    }
  }, [searchQuery, data]);

  const handleChange = event => setSearchQuery(event.target.value);

  if (loading) return <CircularLoader />
  if (error) return <span>ERROR: {error.message}</span>


  const handleClickForData = orgUnitId => {
  props.setActiveOrgUnit(orgUnitId);
  props.setActivePage("Browse");
};

return (
    <div>

        <h1 style={{ textAlign: 'center' }}>Welcome</h1> 

         <div className="input-container" style={{ display: 'flex', justifyContent: 'center' }}>
            <input
                className="input-field"
                type="text"
                placeholder="Search your organization here.."
                value={searchQuery}
                onChange={handleChange}
                style={{ fontSize: '1.5rem', padding: '10px', width: '50%' }} // adjust as needed
            />
        </div>
    <div className="container" style={{ paddingTop: '20px', height: '100%', position: 'fixed', overflowY: 'auto' }}>
       
  
        <div className="table-container" style={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
            <div className="header">
            </div>
            <div className="content" style={{display: 'flex', flexWrap: 'wrap'}}>
                
            {filteredUnits.slice(0, 27).map(({ id, displayName }) => (
                        <div
                            className="menu-item"
                            key={id}
                            style={{ flex: '1 0 30%', border: '1px solid gray', margin: '10px', padding: '10px' }}

                            >
                            {displayName}
                        </div>
                    ))}

                 {filteredUnits.length === 1 && (
                    <img src='test.jpg' alt='clinicalPhoto' style={{ width: '100%', marginTop: '20px' }}/>
                 )}
            </div>
        </div>
    </div></div>
);

}