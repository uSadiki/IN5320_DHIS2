import React, { useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import "../Css/NearByUnits.css"; 
import FetchNearbyData from './NearByClinicHelper/FetchNearbyData';
import image1 from '../Images/Geoma Jagor CHC.jpeg';
import image2 from '../Images/Upper Komende MCHP.jpeg';

//Store images
const imageMap = {
    'Geoma Jagor CHC': image1,
    'Upper Komende MCHP': image2,
  };

//Org unit query for parent
const OrgUnitQuery = {
    orgUnits: {
        resource: "/organisationUnits",
        params:{
            fields: "id,name",
            filter: "parent.id:eq:NqWaKXcg01b"
        }
    }
}

export function NearbyUnits() {
    const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
    const [selectedOrgUnitName, setSelectedOrgUnitName] = useState(null);

    const handleClickForData = (orgUnitId, orgUnitName) => {
        setSelectedOrgUnit(orgUnitId);
        setSelectedOrgUnitName(orgUnitName);
      };
    
    const { loading, error, data } = useDataQuery(OrgUnitQuery)
    if (loading) return <CircularLoader />
    if (error) return <span>ERROR: {error.message}</span>
    
    if (data) {
        const organizationUnits = data.orgUnits.organisationUnits;
        
        //Filter away our orgunit
        const filteredOrganizationUnits = organizationUnits.filter(({ id }) => id !== 'FNnj3jKGS7i');

        return (
            
            <div className="table-container" >
                <div className="header">
                    {<h1>Request From Nearby Units</h1>}
                </div>

               
                <div className="content">
                    {filteredOrganizationUnits.map(({ id, name }) => (
                        <div
                            className="menu-item"
                            key={id}
                            onClick={() => handleClickForData(id,name)}
                        >
                            <h4>{name}</h4>
                            <img src={imageMap[name]} alt={name} />
                        </div>
                    ))}

                    {selectedOrgUnit && <FetchNearbyData orgUnit={selectedOrgUnit}
                            orgUnitName={selectedOrgUnitName} 
                            setSelectedOrgUnit={setSelectedOrgUnit}
                            />}

                </div>
           
            </div>
        )
    };
}