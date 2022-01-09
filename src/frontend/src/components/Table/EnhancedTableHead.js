import React from "react";

import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";

const EnhancedTableHead = (props) => {
  const { order, orderBy, onRequestSort, headCells, actions } = props;

  const listHeadsWithSort = headCells.map(
    (headCell) =>
      headCell.display !== false &&
      (!!headCell.disableSort ? (
        <TableCell key={headCell.id}>{headCell.label}</TableCell>
      ) : (
        <TableCell
          key={headCell.id}
          sortDirection={
            orderBy === (headCell.sortName ? headCell.sortName : headCell.id)
              ? order
              : false
          }
        >
          <TableSortLabel
            active={
              orderBy === (headCell.sortName ? headCell.sortName : headCell.id)
            }
            direction={
              orderBy === (headCell.sortName ? headCell.sortName : headCell.id)
                ? order
                : "asc"
            }
            onClick={() =>
              onRequestSort(headCell.sortName ? headCell.sortName : headCell.id)
            }
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <Box component="span" sx={visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </Box>
            ) : null}
          </TableSortLabel>
        </TableCell>
      ))
  );

  return (
    <TableHead>
      <TableRow>
        {listHeadsWithSort}
        {actions && <TableCell align="center">Actions</TableCell>}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;
