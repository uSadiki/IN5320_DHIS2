import React from 'react';
import { Table, TableBody, TableCell, TableCellHead, TableHead, TableRow, TableRowHead, InputField} from '@dhis2/ui';

const CommoditiesTable = ({ filteredCommodities }) => {
  return (
    <Table>
      <TableHead>
        <TableRowHead>
          <TableCellHead>Commodities</TableCellHead>
          <TableCellHead>Administered</TableCellHead>
          <TableCellHead>End Balance</TableCellHead>
          <TableCellHead>Consumption</TableCellHead>
          <TableCellHead>Quantity to be ordered</TableCellHead>
          <TableCellHead>ID</TableCellHead>
        </TableRowHead>
      </TableHead>

      <TableBody>
        {filteredCommodities.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.displayName.replace('Commodities - ', '')}</TableCell>
            <TableCell>{item.administered}</TableCell>
            <TableCell>{item.endBalance}</TableCell>
            <TableCell>{item.consumption}</TableCell>
            <TableCell>{item.quantityToBeOrdered}</TableCell>
            <TableCell>{item.id}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CommoditiesTable;