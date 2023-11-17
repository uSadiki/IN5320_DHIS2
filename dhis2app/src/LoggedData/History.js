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

  //Saves data depending on what segment we are in.
  const data = showTransactions ? transactionsData : recountsData;

  //Filtered data for the calendar filtering
  let filteredData = [];

  //Pagination data
  const itemsPerPage = 5; // Adjust the number of items per page as needed
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let paginatedData = null;

  //If we have the data..
  if (data) {

    paginatedData = Object.entries(data).slice(startIndex, endIndex);
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

  const handleSegmentedControlChange = ({ value }) => {
    setShowTransactions(value === 'transactions');
  
      setCurrentPage(1);
    
  };
    
  return (
      <div>
        <h1>{showTransactions ? 'Transaction' : 'Recount'} History</h1>

        <SegmentedControl
          selected={showTransactions ? 'transactions' : 'recounts'}
          onChange={handleSegmentedControlChange  }
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
            
           {dateFilter !== "" ? (
                // Render content when dateFilter has a value
                filteredData.map(([id, item]) => (
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
                        ) : (
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
                ))
              ) : (
                <>
               {paginatedData !== null && (
                <>
                  {paginatedData.map(([transactionKey, transaction], index) => (
                    <React.Fragment key={transactionKey}>
                      {transaction && (
                        <>
                          {showTransactions ? (
                            transaction.Commodities?.map((commodity, commodityIndex) => (
                              <TableRow key={`${transactionKey}-${commodityIndex}`}>
                                {commodityIndex === 0 ? (
                                  <TableCell rowSpan={`${transaction.Commodities.length}`}>{transaction.date.split(",")[0]}</TableCell>
                                ) : null}
                                <TableCell>{commodity.commodity.substring(13)}</TableCell>
                                <TableCell>{commodity.value}</TableCell>
                                <TableCell>{transaction.dispensedBy}</TableCell>
                                <TableCell>{transaction.dispensedTo}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <>
                              {transaction.Commodities &&
                                Object.entries(transaction.Commodities).map(([commodityName, commodity], commodityIndex) => (
                                  <TableRow key={`${transactionKey}-${commodityName}`}>
                                    {commodityIndex === 0 ? (
                                      <TableCell rowSpan={String(Object.entries(transaction.Commodities).length)}>{transaction.Date.split(",")[0]}</TableCell>
                                    ) : null}
                                    <TableCell>{commodityName}</TableCell>
                                    <TableCell>{transaction.ChangedBy}</TableCell>
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
                </>
              )}
              </>
              )}
          </TableBody>
        </Table>

        <>  
        
        {paginatedData !== null && dateFilter === "" && (
          <div className="pagination-container">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">Page {currentPage} of {Math.ceil(Object.entries(data).length / itemsPerPage)}</span>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(Object.entries(data).length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(Object.entries(data).length / itemsPerPage)}
            >
              Next
            </button>
          </div>
)}
        </>
      </div>
  );
}