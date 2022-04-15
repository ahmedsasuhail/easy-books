import React from "react";

import { IconButton } from "@material-ui/core";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddBox as AddBoxIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@material-ui/icons";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const EnhancedTableContent = (props) => {
  const {
    rows,
    headCells,
    submitAddFunction,
    actions,
    openEditFunction,
    submitDeleteFunction,
    submitReturnFunction,
  } = props;

  let listContent = [];

  if (rows.length > 0) {
    listContent = rows.map((row, index) => {
      if (
        (submitAddFunction && row.quantity === 0) ||
        row.purchase_name === "Not Specified"
      ) {
        return <></>;
      }

      const labelId = `enhanced-table-checkbox-${index}`;

      const value = {};
      headCells.forEach((head) => {
        if (head.id === "sn") {
          value["id"] = row["id"];
        } else if (head.id === "date") {
          value["date"] = row.date.split("/").reverse().join("-");
        } else {
          value[head.id] = row[head.id];
        }
      });
      const list = headCells.map((cell, idx) => {
        if (cell.display !== false) {
          const opts = {};
          if (cell.id === "sn") {
            opts.id = labelId;
          }
          if (cell.id === "quantity") {
            return (
              <TableCell {...opts} key={idx}>
                {row[cell.id] === 0 ? "Sold Out" : row[cell.id]}
              </TableCell>
            );
          }
          if (!!cell.checkbox) {
            return (
              <TableCell key={idx} align="center">
                <IconButton
                  onClick={() => {
                    value.returned = !value.returned;
                    submitReturnFunction(value);
                  }}
                  color="primary"
                  component="span"
                  size="small"
                >
                  {value.returned ? (
                    <CheckBoxIcon fontSize="small" />
                  ) : (
                    <CheckBoxOutlineBlankIcon fontSize="small" />
                  )}
                </IconButton>
              </TableCell>
            );
          } else {
            return (
              <TableCell {...opts} key={idx}>
                {row[cell.id]}
              </TableCell>
            );
          }
        } else return false;
      });
      return (
        <TableRow
          selected={
            (row.name && row.id === props.linkId) ||
            (row.part_name && row.id === props.linkId) ||
            (row.company_name && row.id === props.linkId)
          }
          hover
          role="checkbox"
          tabIndex={-1}
          key={index}
        >
          {list}
          {actions && (
            <TableCell align="center">
              {submitAddFunction && (
                <IconButton
                  onClick={() => submitAddFunction(value)}
                  color="primary"
                  component="span"
                  size="small"
                >
                  <AddBoxIcon fontSize="small" />
                </IconButton>
              )}
              {openEditFunction && (
                <IconButton
                  onClick={() => openEditFunction(value)}
                  color="primary"
                  component="span"
                  size="small"
                  disabled={row.returned}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
              {submitDeleteFunction && (
                <IconButton
                  onClick={() => submitDeleteFunction(row.id)}
                  color="primary"
                  component="span"
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
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
        <TableCell align="center" colSpan={headCells.length + 1}>
          No records found in this page!
        </TableCell>
      </TableRow>
    );
  }

  return <>{listContent}</>;
};

export default EnhancedTableContent;
