import React, { useState } from 'react';
import { getData } from '../DataStoreUtils/DatastorePull';
import '../Css/History.css'
import DateFilteredContent from './HistoryData/DateFilteredContent';
import PaginatedDataContent from './HistoryData/PaginatedDataContent';
import ButtonComponent from './ButtonComponent';
import { CircularLoader, 
  Table, 
  TableHead, 
  TableRowHead, 
  TableCellHead, 
  TableBody, 
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
                <DateFilteredContent filteredData={filteredData} showTransactions={showTransactions} />
              ) : (
                <PaginatedDataContent paginatedData={paginatedData} showTransactions={showTransactions} />
              )}

          </TableBody>
        </Table>

        <>  

        {paginatedData !== null && dateFilter === "" && (
            <ButtonComponent
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              data={data}
              itemsPerPage={itemsPerPage}
            />
        )}

  
        </>
      </div>
  );
}
