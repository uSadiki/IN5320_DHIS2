import React from 'react';
import { getData } from '../DataStoreUtils/DatastorePull';
import { RecountManager } from './RecountComponents/RecountManager';
<<<<<<< Updated upstream
import '../CSS/Shared.css';
=======

import '../Css/Shared.css';
>>>>>>> Stashed changes


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