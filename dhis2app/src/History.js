import React, { useEffect, useState } from 'react'

import { getData } from './DatastorePull.js'

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

export function History() {

  const data = getData("Recipients");
  
  console.log(data)
  return (
    <div>
      <button>Transactions</button>
      <button>Recount adjustments</button>
    </div>
  );
}
