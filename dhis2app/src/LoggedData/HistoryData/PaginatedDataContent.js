import React from 'react';
import {  TableRow, TableCell } from '@dhis2/ui';

//Data holder for the pagination option
const PaginatedDataContent = ({ paginatedData, showTransactions }) => (
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
);

export default PaginatedDataContent;
