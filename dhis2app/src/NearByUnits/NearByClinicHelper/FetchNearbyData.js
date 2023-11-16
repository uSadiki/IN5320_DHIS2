import React from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import * as CommonUtils from '../../CommonUtils'; 
import DisplayNearbyData from './DisplayNearbyData';
import { CircularLoader } from '@dhis2/ui';


//Need to use variable so we dont render query in the function
const dataQuery = {
  dataValues: {
    resource: 'dataValueSets',
    params: ({ orgUnit, date }) => ({
      orgUnit,
      period: date,
      dataSet: 'ULowA8V3ucd',
      fields: ['id'],
    }),
  },
  dataElements: {
    resource: 'dataElements',
    params: {
      fields: ['id', 'displayName'],
      filter: 'displayName:like:Commodities',
    },
  },
};


//Fetches data from the api for the selected orgUnit
function FetchNearbyData({ orgUnit, orgUnitName, setSelectedOrgUnit }) {
  const { loading, error, data } = useDataQuery(dataQuery, {
    variables: {
      orgUnit,
      date: CommonUtils.getFormattedDate(),
    },
  });

  // Error handling
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  // Loading handling
  if (loading) {
    return <CircularLoader large className="loading-circle"/>;
  }

  // Data handling
  if (data) {
    return (
      <div>
      <DisplayNearbyData data={data} orgUnitName={orgUnitName} setSelectedOrgUnit={setSelectedOrgUnit} />

      </div>
    );
  }

  return null;
}

export default FetchNearbyData;
