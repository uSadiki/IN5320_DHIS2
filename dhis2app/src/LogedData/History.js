import React, { useState } from 'react';
import { getData } from '../DataStoreUtils/DatastorePull';
import '../Css/History.css'
import { CircularLoader, 
  Table, 
  TableHead, 
  TableRowHead, 
  TableCellHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  SegmentedControl} from '@dhis2/ui';

//Function to show transaction history and recount history
export function History() {

  const [showTransactions, setShowTransactions] = useState(true);
  const [dateFilter, setDateFilter] = useState(""); // Initial filter value
  
  const handleDateFilterChange = (event) => setDateFilter(event.target.value);

  //Get data for both transaction and recounts
  const transactionsData = getData("Transactions");
  const recountsData = getData("Recounts");

  if (transactionsData === null || recountsData === null) {
    return <CircularLoader />;
  }

  const data = showTransactions ? transactionsData : recountsData;

  let filteredData = [];
  
  if (data) {
    filteredData = Object.entries(data).filter(
      ([, item]) => {
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
      }
    );
  }

  const headers = showTransactions
    ? ['Date', 'Commodities', 'Values', 'Dispensed By', 'Dispensed To']
    : ['Date', 'Commodities', 'Changed By', 'From Value', 'To Value'];

  return (
      <div>
        <h1>{showTransactions ? 'Transaction' : 'Recount'} History</h1>

        <SegmentedControl
          selected={showTransactions ? 'transactions' : 'recounts'}
          onChange={({ value }) => setShowTransactions(value === 'transactions')}
          options={[
            { value: 'transactions', label: 'Transactions' },
            { value: 'recounts', label: 'Recounts' },
          ]}
        />

        Filter by Date: <br></br>
        <input 
          type="date" 
          value={dateFilter} 
          onChange={handleDateFilterChange} 
          className='filter'/>


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
                            <TableCell rowSpan={`${item.Commodities.length}`}>{item.date.split(",")[0]}</TableCell>
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
                          Object.entries(item.Commodities).map(([commodityName, commodity], index) => (
                            <TableRow key={`${id}-${commodityName}`}>
                              {index === 0 ? (
                                <TableCell rowSpan={String(Object.entries(item.Commodities).length)}>{item.Date.split(",")[0]}</TableCell>
                              ) : null}
                              <TableCell>{commodityName}</TableCell>
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
