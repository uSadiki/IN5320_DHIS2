import React from 'react';
import { useDataQuery } from '@dhis2/app-runtime';
import * as CommonUtils from '../CommonUtils';
import DataFetchingComponent from './DataFetchingComponent';
import { CircularLoader } from '@dhis2/ui';


function MainFetchComponent({ orgUnit,orgUnitName,setSelectedOrgUnit,setRequested}) {
  const dataQuery = {
    dataValues: {
      resource: '/dataValueSets',
      params: {
        orgUnit,
        period: CommonUtils.getFormattedDate(),
        dataSet: 'ULowA8V3ucd',
        fields: ['id'],
      },
    },
    dataElements: {
      resource: '/dataElements',
      params: {
        fields: ['id', 'displayName'],
        filter: 'displayName:like:Commodities',
      },
    },
  };

  const { loading, error, data } = useDataQuery(dataQuery);

  // Error handling
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  // Loading handling
  if (loading) {
    return <CircularLoader large />;
  }

  // Data handling
  if (data) {
    return (
      <div>
        <DataFetchingComponent  data={data} orgUnitName={orgUnitName} setSelectedOrgUnit={setSelectedOrgUnit}  setRequested={setRequested} />
      </div>
    );
  }

  return null;
}

export default MainFetchComponent;
