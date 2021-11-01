import React from 'react';

import { IconButton } from '@material-ui/core';
import { Edit as EditIcon, Delete as DeleteIcon } from '@material-ui/icons';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

const EnhancedTableContent = (props) => {
  const {
    rows,
    headCells,
    openEditMiscellaneous,
    submitDeleteMiscellaneous,
    actions,
  } = props;

  let listContent = [];

  if (rows.length > 0) {
    listContent = rows.map((row, index) => {
      const labelId = `enhanced-table-checkbox-${index}`;

      const value = {};
      headCells.forEach((head) => {
        if (head.id === 'sn') {
          value['id'] = row['id'];
        } else if (head.id === 'date') {
          value['date'] = row.date.split('/').reverse().join('-');
        } else {
          value[head.id] = row[head.id];
        }
      });

      const list = headCells.map((cell, idx) => {
        const opts = {};
        if (cell.id === 'sn') {
          opts.id = labelId;
        }
        return (
          <TableCell {...opts} key={idx}>
            {row[cell.id]}
          </TableCell>
        );
      });

      return (
        <TableRow hover role='checkbox' tabIndex={-1} key={index}>
          {list}
          {actions && (
            <TableCell align='center'>
              {openEditMiscellaneous && (
                <IconButton
                  onClick={() => openEditMiscellaneous(value)}
                  color='primary'
                  aria-label='create-edit-miscellaneous'
                  component='span'
                  size='small'
                >
                  <EditIcon fontSize='small' />
                </IconButton>
              )}
              {submitDeleteMiscellaneous && (
                <IconButton
                  onClick={() => submitDeleteMiscellaneous(row.id)}
                  color='primary'
                  aria-label='delete-miscellaneous'
                  component='span'
                  size='small'
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              )}
            </TableCell>
          )}
        </TableRow>
      );
    });
  } else {
    listContent = (
      <TableRow>
        <TableCell align='center' colSpan={headCells.length + 1}>
          No records found in this page!
        </TableCell>
      </TableRow>
    );
  }

  return <>{listContent}</>;
};

export default EnhancedTableContent;
