import React, { useState } from 'react';
import { getData } from '../DataStoreUtils/DatastorePull';
import { CircularLoader, Table, TableHead, TableRowHead, TableCellHead, TableBody, TableRow, TableCell, SwitchField,ButtonStrip,Button } from '@dhis2/ui';

//Function to show transaction history and recount history
export function History() {

  const [showTransactions, setShowTransactions] = useState(true);
  const [dateFilter, setDateFilter] = useState(""); // Initial filter value
  
  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  }
  


  //Get data for both transaction and recounts
  const transactionsData = getData("Transactions");
  const recountsData = getData("Recounts");

  if (transactionsData == null || recountsData == null) {
    return <CircularLoader />;
  }

  const onSwitchChange = () => {
    setShowTransactions(!showTransactions);
  };




  const data = showTransactions ? transactionsData : recountsData;


  const filteredData = Object.entries(data)
  .filter(([, item]) => {
    let date, time;

    if (showTransactions) {
      [date, time] = item.date.split(', ');
    } else {
      [date, time] = item.Date.split(', ');
    }
    const [day, month, year] = date.split('/');
    const formattedItemDate = `${year}-${month}-${day}`;

    // Check if showTransaction is true and the date matches the filter
    return  (!dateFilter || formattedItemDate === dateFilter);
  });

  

  const headers = showTransactions
    ? ['Date', 'Commodities', 'Values', 'Dispensed By', 'Dispensed To']
    : ['Date', 'Commodities', 'Changed By', 'From Value', 'To Value'];

    return (
      
      <div>
          
        
        <h1>{showTransactions ? 'Transactions' : 'Recounts'} History</h1>


        Filter By date <input type="date" value={dateFilter} onChange={handleDateFilterChange} />


        <SwitchField 
          checked={showTransactions}
          onChange={onSwitchChange}
          label={`Show ${showTransactions ? 'Transactions' : 'Recounts'}`}
        />

        <Table>
          <TableHead>

            <TableRowHead>
              {headers.map((header) => (
                <TableCellHead key={header}>{header}</TableCellHead>
              ))}
            </TableRowHead>

          </TableHead>
          
          <TableBody>
            {filteredData.map(([id, item]) => (
              <React.Fragment key={id}>
                {item && (
                  <>

                    {showTransactions ? (
                      item.Commodities?.map((commodity, index) => (
                        
                        <TableRow key={`${id}-${index}`}>
                          {index === 0 ? (
                            <TableCell rowSpan={`${item.Commodities.length}`}>{item.date}</TableCell>
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
                        {item.Commodities && 
                          Object.entries(item.Commodities).map(([commodityId, commodity], index) => (
                            <TableRow key={`${id}-${commodityId}`}>
                              {index === 0 ? (
                                <TableCell rowSpan={String(Object.entries(item.Commodities).length)}>{item.Date}</TableCell>

                              ) : null}
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