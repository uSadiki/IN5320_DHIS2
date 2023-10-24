import React, { useState,useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime'
import { CircularLoader,AlertBar } from '@dhis2/ui'
import "./start.css"; // Import the CSS file
import MainFetchComponent from './NearByClinicHelper/MainFetchComponent';


const OrgUnitQuery = {
    orgUnits: {
        resource: "/organisationUnits",
        params:{
            fields: "id,name",
            filter: "parent.id:eq:NqWaKXcg01b"
        }
    }
}

export function NearByUnits(props) {


    const [selectedOrgUnit, setSelectedOrgUnit] = useState(null);
    const [selectedOrgUnitName, setSelectedOrgUnitName] = useState(null);
    const [requested, setRequested] = useState(false);

    //Make requested false so we can get alert again
    useEffect(() => {
        if (requested) {
            const timerId = setTimeout(() => {
                setRequested(false);
            }, 2000);  // 4000ms = 4 seconds
    
            // Cleanup function to clear the timeout when the component unmounts
            return () => clearTimeout(timerId);
        }
    }, [requested]); 

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
            <div className="table-container" style={{ height: 'calc(100% - 70px)', overflowY: 'auto' }}>
                <div className="header">
                    {/* Your header content */}
                </div>

               
                <div className="content" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {filteredOrganizationUnits.map(({ id, name }) => (
                        <div
                            className="menu-item"
                            key={id}
                            style={{
                                flex: '1 0 30%',
                                border: '1px solid gray',
                                margin: '10px',
                                padding: '10px'
                            }}
                            onClick={() => handleClickForData(id,name)}
                        >
                            {name}
                        </div>
                    ))}

{selectedOrgUnit && <MainFetchComponent orgUnit={selectedOrgUnit}
                 orgUnitName={selectedOrgUnitName} 
                 setSelectedOrgUnit={setSelectedOrgUnit}
                 setRequested={setRequested}/>}

                </div>
                {requested && (
        <>
        <React.Fragment key=".0">
            
            <AlertBar permanent success>
                Request successful
            </AlertBar>
            
        </React.Fragment>
           </>
     )}
            </div>
        )
    };
}