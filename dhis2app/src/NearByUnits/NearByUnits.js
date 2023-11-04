import React, { useState } from 'react';
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader } from '@dhis2/ui'
import "../Css/start.css"; 
import FetchNearbyData from './NearByClinicHelper/FetchNearbyData';


const OrgUnitQuery = {
    orgUnits: {
        resource: "/organisationUnits",
        params:{
            fields: "id,name",
            filter: "parent.id:eq:NqWaKXcg01b"
        }
    }
}

export function NearByUnits() {


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
                    {/* Headr */}
                </div>

               
                <div className="content">
                    {filteredOrganizationUnits.map(({ id, name }) => (
                        <div
                            className="menu-item"
                            key={id}
                            onClick={() => handleClickForData(id,name)}
                        >
                            {name}
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