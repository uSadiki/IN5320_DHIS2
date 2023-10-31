import React, { useState } from 'react';
import { getData } from './DatastorePull';
import { CircularLoader, Table, TableHead, TableRowHead, TableCellHead, TableBody, TableRow, TableCell } from '@dhis2/ui';

export function History() {
  const [showTransactions, setShowTransactions] = useState(false);
  const transactionsData = getData("Transactions");
  const recountsData = getData("Recounts");

  if (transactionsData == null || recountsData == null) {
    return <CircularLoader />;
  }
  console.log("transactionsData:", transactionsData.request0);
  console.log("recountsData:", recountsData);
  
  const data = showTransactions ? transactionsData : recountsData;
  const headers = showTransactions
    ? ['Date','Commodities', 'Values', 'Dispensed By', 'Dispensed To']
    : ['Commodities', 'Changed By', 'From Value', 'To Value'];

  return (
    <div>
      <h1>{showTransactions ? 'Transactions' : 'Recounts'} History</h1>
      <button onClick={() => setShowTransactions(!showTransactions)}>
        {showTransactions ? 'Show Recounts' : 'Show Transactions'}
      </button>
      <Table>
        <TableHead>
          <TableRowHead>
            {headers.map((header) => (
              <TableCellHead key={header}>{header}</TableCellHead>
            ))}
          </TableRowHead>
        </TableHead>
        <TableBody>
          {Object.entries(data.request0).map(([id, item]) => (
            <React.Fragment key={id}>
              {item && (
                <>
                  {showTransactions ? (
                    item.Commodities?.map((commodity, index) => (
                      <TableRow key={`${id}-${index}`}>
                        {index === 0 ? (
                          <TableCell rowSpan={item.Commodities.length}>{item.date}</TableCell>
                        ) : null}
                        <TableCell>{commodity.commodity.substring(13)}</TableCell>
                        <TableCell>{commodity.value}</TableCell>
                        <TableCell>{item.dispensedBy}</TableCell>
                        <TableCell>{item.dispensedTo}</TableCell>
                      </TableRow>
                    ))
                  ) 
                  
                  
                  
                  : (
                    <>
                      {item.Commodities && // Add the check for item.Commodities being defined
                        Object.entries(item.Commodities).map(([commodityId, commodity]) => (
                          <TableRow key={`${id}-${commodityId}`}>
                            <TableCell>{commodityId}</TableCell>
                            <TableCell>{item.ChangedBy}</TableCell>
                            <TableCell>{commodity.fromValue}</TableCell>
                            <TableCell>{commodity.toValue}</TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}
                </>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
