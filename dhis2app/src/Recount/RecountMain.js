import React from 'react';
import { getData } from '../DataStoreUtils/DatastorePull';
import { RecountManager } from './RecountComponents/RecountManager';
import '../Css/main.css';


//Main Recount starter
export function RecountMain({ orgUnit, commodityData,user }) {


      return ( 
            <RecountManager
            orgUnit={orgUnit}
            commodityData={commodityData}
            user={user}
            earlierRecounts={ getData("Recounts")}
                />
      );
    };