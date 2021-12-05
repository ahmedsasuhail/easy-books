import * as React from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@material-ui/core";

import useStyles from "./styles";

export default function SpanningTable(props) {
  const classes = useStyles();

  let rows;

  const [salesOpen, setSalesOpen] = React.useState(false);
  const [purchasedOpen, setPurchasedOpen] = React.useState(false);
  const [returnedOpen, setReturnedOpen] = React.useState(false);
  const [creditedOpen, setCreditedOpen] = React.useState(false);
  const [expensesOpen, setExpensesOpen] = React.useState(false);
  const [unsoldOpen, setUnsoldOpen] = React.useState(false);

  if (
    (props.purchaseRows && !!props.purchaseRows.id) ||
    (props.relationshipRows &&
      props.relationshipRows.credited_sales_total +
        props.relationshipRows.purchased_total +
        props.relationshipRows.sales_returned_total +
        props.relationshipRowssales_total >
        0) ||
    (props.rangeRows && !!props.rangeRows.total)
  ) {
    rows = (
      <>
        <TableHead className={classes.headBgColor}>
          <TableRow>
            <TableCell className={classes.headCell}>
              {props.relationshipRows && props.relationshipRows.name}
              {props.purchaseRows &&
                `${props.purchaseRows.company_name} - ${props.purchaseRows.vehicle_name}`}
              {props.rangeRows &&
                `Report for ${props.fromDate} to ${props.toDate}`}
            </TableCell>
            <TableCell className={classes.headCell} align="right">
              {props.purchaseRows && props.purchaseRows.price}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(props.relationshipRows
            ? props.relationshipRows.sales_total +
                props.relationshipRows.sales_returned_total +
                props.relationshipRows.credited_sales_total >
              0
            : props.rangeRows
            ? props.rangeRows.sales_total > 0
            : true) && (
            <>
              <TableRow className={classes.rowBgColor}>
                <TableCell className={classes.cellBold}>
                  <span>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setSalesOpen(!salesOpen)}
                    >
                      {salesOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </span>
                  Sales
                </TableCell>
                <TableCell className={classes.headCellSuccess} align="right">
                  {props.purchaseRows
                    ? props.purchaseRows.sales_total +
                      props.purchaseRows.sales_returned_total +
                      props.purchaseRows.credited_sales_total
                    : props.relationshipRows
                    ? props.relationshipRows.sales_total +
                      props.relationshipRows.sales_returned_total +
                      props.relationshipRows.credited_sales_total
                    : props.rangeRows && props.rangeRows.sales_total}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.cellPadding} colSpan={2}>
                  <Collapse in={salesOpen} timeout="auto" unmountOnExit>
                    <Box className={classes.box}>
                      <Typography variant="h6" gutterBottom component="div">
                        Items
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.cellBold}>
                              Part Name
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Date
                            </TableCell>
                            <TableCell className={classes.cellBold}>
                              Returned
                            </TableCell>
                            <TableCell className={classes.cellBold}>
                              Credited
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Price
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Quantity
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {props.purchaseRows &&
                            props.purchaseRows.sales &&
                            props.purchaseRows.sales.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.part_name}</TableCell>
                                <TableCell align="right">
                                  {
                                    new Date(item.date)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </TableCell>
                                <TableCell>No</TableCell>
                                <TableCell>No</TableCell>
                                <TableCell align="right">
                                  {item.price}
                                </TableCell>
                                <TableCell align="right">
                                  {item.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                          {props.purchaseRows &&
                            props.purchaseRows.sales_returned &&
                            props.purchaseRows.sales_returned.map(
                              (item, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.part_name}</TableCell>
                                  <TableCell align="right">
                                    {
                                      new Date(item.date)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </TableCell>
                                  <TableCell>Yes</TableCell>
                                  <TableCell>
                                    {item.credit ? "Yes" : "No"}
                                  </TableCell>
                                  <TableCell align="right">
                                    {item.price}
                                  </TableCell>
                                  <TableCell align="right">
                                    {item.quantity}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          {props.purchaseRows &&
                            props.purchaseRows.credited_sales &&
                            props.purchaseRows.credited_sales.map(
                              (item, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.part_name}</TableCell>
                                  <TableCell align="right">
                                    {
                                      new Date(item.date)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </TableCell>
                                  <TableCell>No</TableCell>
                                  <TableCell>Yes</TableCell>
                                  <TableCell align="right">
                                    {item.price}
                                  </TableCell>
                                  <TableCell align="right">
                                    {item.quantity}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          {props.relationshipRows &&
                            props.relationshipRows.sales &&
                            props.relationshipRows.sales.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.part_name}</TableCell>
                                <TableCell align="right">
                                  {
                                    new Date(item.date)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </TableCell>
                                <TableCell>No</TableCell>
                                <TableCell>No</TableCell>
                                <TableCell align="right">
                                  {item.price}
                                </TableCell>
                                <TableCell align="right">
                                  {item.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                          {props.relationshipRows &&
                            props.relationshipRows.sales_returned &&
                            props.relationshipRows.sales_returned.map(
                              (item, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.part_name}</TableCell>
                                  <TableCell align="right">
                                    {
                                      new Date(item.date)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </TableCell>
                                  <TableCell>Yes</TableCell>
                                  <TableCell>
                                    {item.credit ? "Yes" : "No"}
                                  </TableCell>
                                  <TableCell align="right">
                                    {item.price}
                                  </TableCell>
                                  <TableCell align="right">
                                    {item.quantity}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          {props.relationshipRows &&
                            props.relationshipRows.credited_sales &&
                            props.relationshipRows.credited_sales.map(
                              (item, idx) => (
                                <TableRow key={idx}>
                                  <TableCell>{item.part_name}</TableCell>
                                  <TableCell align="right">
                                    {
                                      new Date(item.date)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                  </TableCell>
                                  <TableCell>No</TableCell>
                                  <TableCell>Yes</TableCell>
                                  <TableCell align="right">
                                    {item.price}
                                  </TableCell>
                                  <TableCell align="right">
                                    {item.quantity}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          {props.rangeRows &&
                            props.rangeRows.sales &&
                            props.rangeRows.sales.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.part_name}</TableCell>
                                <TableCell align="right">
                                  {
                                    new Date(item.date)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </TableCell>
                                <TableCell>
                                  {item.returned ? "Yes" : "No"}
                                </TableCell>
                                <TableCell>
                                  {item.credit ? "Yes" : "No"}
                                </TableCell>
                                <TableCell align="right">
                                  {item.price}
                                </TableCell>
                                <TableCell align="right">
                                  {item.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          )}
          {(props.relationshipRows || props.rangeRows) &&
            (props.rangeRows ? props.rangeRows.purchased_total > 0 : true) &&
            (props.relationshipRows
              ? props.relationshipRows.purchased_total > 0
              : true) && (
              <>
                <TableRow className={classes.rowBgColor}>
                  <TableCell className={classes.cellBold}>
                    <span>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => {
                          setPurchasedOpen(!purchasedOpen);
                        }}
                      >
                        {purchasedOpen ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </span>
                    Purchased
                  </TableCell>
                  <TableCell className={classes.headCellError} align="right">
                    {props.relationshipRows
                      ? props.relationshipRows.purchased_total
                      : props.rangeRows && props.rangeRows.purchased_total}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellPadding} colSpan={2}>
                    <Collapse in={purchasedOpen} timeout="auto" unmountOnExit>
                      <Box className={classes.box}>
                        <Typography variant="h6" gutterBottom component="div">
                          Items
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.cellBold}>
                                Purchase Name
                              </TableCell>
                              <TableCell
                                className={classes.cellBold}
                                align="right"
                              >
                                Date
                              </TableCell>
                              <TableCell
                                className={classes.cellBold}
                                align="right"
                              >
                                Price
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {props.relationshipRows &&
                            props.relationshipRows.purchases
                              ? props.relationshipRows.purchases.map(
                                  (item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>
                                        {item.company_name} -{" "}
                                        {item.vehicle_name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {
                                          new Date(item.date)
                                            .toISOString()
                                            .split("T")[0]
                                        }
                                      </TableCell>
                                      <TableCell align="right">
                                        {item.price}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              : props.rangeRows &&
                                props.rangeRows.purchases &&
                                props.rangeRows.purchases.map((item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      {item.company_name} - {item.vehicle_name}
                                    </TableCell>
                                    <TableCell align="right">
                                      {
                                        new Date(item.date)
                                          .toISOString()
                                          .split("T")[0]
                                      }
                                    </TableCell>
                                    <TableCell align="right">
                                      {item.price}
                                    </TableCell>
                                  </TableRow>
                                ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            )}

          {!props.rangeRows &&
            ((props.purchaseRows &&
              props.purchaseRows.sales_returned_total > 0) ||
              (props.relationshipRows &&
                props.relationshipRows.sales_returned_total > 0)) && (
              <>
                <TableRow className={classes.rowBgColor}>
                  <TableCell className={classes.cellBold}>
                    <span>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setReturnedOpen(!returnedOpen)}
                      >
                        {returnedOpen ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </span>
                    Returned
                  </TableCell>
                  <TableCell className={classes.headCellError} align="right">
                    {props.purchaseRows &&
                      props.purchaseRows.sales_returned_total}
                    {props.relationshipRows &&
                      props.relationshipRows.sales_returned_total}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellPadding} colSpan={2}>
                    <Collapse in={returnedOpen} timeout="auto" unmountOnExit>
                      <Box className={classes.box}>
                        <Typography variant="h6" gutterBottom component="div">
                          Items
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.cellBold}>
                                {props.purchaseRows && "Part Name"}
                                {props.relationshipRows && "Purchase Name"}
                              </TableCell>
                              <TableCell
                                className={classes.cellBold}
                                align="right"
                              >
                                Date
                              </TableCell>
                              <TableCell
                                className={classes.cellBold}
                                align="right"
                              >
                                Price
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {props.purchaseRows &&
                            props.purchaseRows.sales_returned
                              ? props.purchaseRows.sales_returned.map(
                                  (item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{item.part_name}</TableCell>
                                      <TableCell align="right">
                                        {
                                          new Date(item.date)
                                            .toISOString()
                                            .split("T")[0]
                                        }
                                      </TableCell>
                                      <TableCell align="right">
                                        {item.price}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              : props.relationshipRows &&
                                props.relationshipRows.sales_returned &&
                                props.relationshipRows.sales_returned.map(
                                  (item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{item.part_name}</TableCell>
                                      <TableCell align="right">
                                        {
                                          new Date(item.date)
                                            .toISOString()
                                            .split("T")[0]
                                        }
                                      </TableCell>
                                      <TableCell align="right">
                                        {item.price}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            )}
          {!props.rangeRows &&
            ((props.purchaseRows &&
              props.purchaseRows.credited_sales_total > 0) ||
              (props.relationshipRows &&
                props.relationshipRows.credited_sales_total > 0)) && (
              <>
                <TableRow className={classes.rowBgColor}>
                  <TableCell className={classes.cellBold}>
                    <span>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setCreditedOpen(!creditedOpen)}
                      >
                        {creditedOpen ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </span>
                    Credited
                  </TableCell>
                  <TableCell className={classes.headCellError} align="right">
                    {props.purchaseRows &&
                      props.purchaseRows.credited_sales_total}
                    {props.relationshipRows &&
                      props.relationshipRows.credited_sales_total}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className={classes.cellPadding} colSpan={2}>
                    <Collapse in={creditedOpen} timeout="auto" unmountOnExit>
                      <Box className={classes.box}>
                        <Typography variant="h6" gutterBottom component="div">
                          Items
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.cellBold}>
                                Part Name
                              </TableCell>
                              <TableCell
                                className={classes.cellBold}
                                align="right"
                              >
                                Date
                              </TableCell>
                              <TableCell
                                className={classes.cellBold}
                                align="right"
                              >
                                Price
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {props.purchaseRows &&
                            props.purchaseRows.credited_sales
                              ? props.purchaseRows.credited_sales.map(
                                  (item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{item.part_name}</TableCell>
                                      <TableCell align="right">
                                        {
                                          new Date(item.date)
                                            .toISOString()
                                            .split("T")[0]
                                        }
                                      </TableCell>
                                      <TableCell align="right">
                                        {item.price}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              : props.relationshipRows &&
                                props.relationshipRows.credited_sales &&
                                props.relationshipRows.credited_sales.map(
                                  (item, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{item.part_name}</TableCell>
                                      <TableCell align="right">
                                        {
                                          new Date(item.date)
                                            .toISOString()
                                            .split("T")[0]
                                        }
                                      </TableCell>
                                      <TableCell align="right">
                                        {item.price}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </>
            )}
          {props.rangeRows && props.rangeRows.expenses_total > 0 && (
            <>
              <TableRow className={classes.rowBgColor}>
                <TableCell className={classes.cellBold}>
                  <span>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => {
                        setExpensesOpen(!expensesOpen);
                      }}
                    >
                      {expensesOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </span>
                  Expenses
                </TableCell>
                <TableCell className={classes.headCellError} align="right">
                  {props.rangeRows.expenses_total}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.cellPadding} colSpan={2}>
                  <Collapse in={expensesOpen} timeout="auto" unmountOnExit>
                    <Box className={classes.box}>
                      <Typography variant="h6" gutterBottom component="div">
                        Items
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.cellBold}>
                              Description
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Date
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Price
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {props.rangeRows.expenses &&
                            props.rangeRows.expenses.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.description}</TableCell>
                                <TableCell align="right">
                                  {
                                    new Date(item.date)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </TableCell>
                                <TableCell align="right">
                                  {item.price}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          )}
          {props.purchaseRows && props.purchaseRows.total_not_sold > 0 && (
            <>
              <TableRow className={classes.rowBgColor}>
                <TableCell className={classes.cellBold}>
                  <span>
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => setUnsoldOpen(!unsoldOpen)}
                    >
                      {unsoldOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </span>
                  Not Sold
                </TableCell>
                <TableCell className={classes.headCellError} align="right">
                  {props.purchaseRows.total_not_sold}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.cellPadding} colSpan={2}>
                  <Collapse in={unsoldOpen} timeout="auto" unmountOnExit>
                    <Box className={classes.box}>
                      <Typography variant="h6" gutterBottom component="div">
                        Items
                      </Typography>
                      <Table size="small" aria-label="purchases">
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.cellBold}>
                              Part Name
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Date
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Price
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align="right"
                            >
                              Quantity
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {props.purchaseRows &&
                            props.purchaseRows.not_sold &&
                            props.purchaseRows.not_sold.map((item, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{item.part_name}</TableCell>
                                <TableCell align="right">
                                  {
                                    new Date(item.date)
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                </TableCell>
                                <TableCell align="right">
                                  {item.price}
                                </TableCell>
                                <TableCell align="right">
                                  {item.quantity}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </>
          )}
          {(props.purchaseRows || props.rangeRows) && (
            <TableRow>
              <TableCell className={classes.cellBold}>Total</TableCell>
              <TableCell
                className={
                  props.purchaseRows &&
                  props.purchaseRows.total &&
                  props.purchaseRows.total.toFixed(2) > 0
                    ? classes.headCellSuccess
                    : props.purchaseRows &&
                      props.purchaseRows.total &&
                      props.purchaseRows.total.toFixed(2) < 0
                    ? classes.headCellError
                    : props.rangeRows &&
                      props.rangeRows.total &&
                      props.rangeRows.total.toFixed(2) > 0
                    ? classes.headCellSuccess
                    : props.rangeRows &&
                      props.rangeRows.total &&
                      props.rangeRows.total.toFixed(2) < 0 &&
                      classes.headCellError
                }
                align="right"
              >
                {props.purchaseRows
                  ? props.purchaseRows.total.toFixed(2)
                  : props.rangeRows
                  ? props.rangeRows.total.toFixed(2)
                  : "0"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </>
    );
  } else {
    rows = (
      <TableHead>
        <TableRow>
          <TableCell>
            {props.isLoading ? <CircularProgress size={16} /> : "No data found"}
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  return (
    <TableContainer className={classes.cellMargin} component={Paper}>
      <Table aria-label="spanning table">{rows}</Table>
    </TableContainer>
  );
}
