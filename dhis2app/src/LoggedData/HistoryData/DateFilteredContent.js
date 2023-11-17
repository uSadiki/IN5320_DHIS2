import React from 'react';
import {  TableRow, TableCell} from '@dhis2/ui';
  
//Data holder for the date filter
const DateFilteredContent = ({ filteredData, showTransactions }) => (
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
);

export default DateFilteredContent;
