import * as React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@material-ui/core';

import useStyles from './styles';

export default function SpanningTable(props) {
  const classes = useStyles();

  let rows;

  const [salesOpen, setSalesOpen] = React.useState(false);
  const [returnedOpen, setReturnedOpen] = React.useState(false);
  const [creditedOpen, setCreditedOpen] = React.useState(false);

  if (
    (props.purchaseRows && !!props.purchaseRows.id) ||
    (props.relationshipRows && !!props.relationshipRows.id)
  ) {
    rows = (
      <>
        <TableHead className={classes.headBgColor}>
          <TableRow>
            <TableCell className={classes.headCell}>
              {props.relationshipRows && props.relationshipRows.name}
              {props.purchaseRows &&
                `${props.purchaseRows.company_name} - ${props.purchaseRows.vehicle_name}`}
            </TableCell>
            <TableCell className={classes.headCell} align='right'>
              {props.purchaseRows && props.purchaseRows.price}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className={classes.rowBgColor}>
            <TableCell className={classes.cellBold}>
              <span>
                <IconButton
                  aria-label='expand row'
                  size='small'
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
            <TableCell
              className={
                props.purchaseRows ? classes.headCellSuccess : classes.cellBold
              }
              align='right'
            >
              {props.purchaseRows
                ? props.purchaseRows.sales_total +
                  props.purchaseRows.sales_returned_total +
                  props.purchaseRows.credited_sales_total
                : props.relationshipRows.sales_total +
                  props.relationshipRows.sales_returned_total +
                  props.relationshipRows.credited_sales_total}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.cellPadding} colSpan={2}>
              <Collapse in={salesOpen} timeout='auto' unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant='h6' gutterBottom component='div'>
                    Items
                  </Typography>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.cellBold}>
                          Part Name
                        </TableCell>
                        <TableCell className={classes.cellBold} align='right'>
                          Date
                        </TableCell>
                        <TableCell className={classes.cellBold}>
                          Returned
                        </TableCell>
                        <TableCell className={classes.cellBold}>
                          Credited
                        </TableCell>
                        <TableCell className={classes.cellBold} align='right'>
                          Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.purchaseRows &&
                        !props.purchaseRows.sales &&
                        !props.purchaseRows.sales_returned &&
                        !props.purchaseRows.credited_sales && (
                          <TableRow>
                            <TableCell colspan={3}>No data found</TableCell>
                          </TableRow>
                        )}
                      {props.relationshipRows &&
                        !props.relationshipRows.sales &&
                        !props.relationshipRows.sales_returned &&
                        !props.relationshipRows.credited_sales && (
                          <TableRow>
                            <TableCell colspan={3}>No data found</TableCell>
                          </TableRow>
                        )}
                      {props.purchaseRows &&
                        props.purchaseRows.sales &&
                        props.purchaseRows.sales.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            <TableCell>No</TableCell>
                            <TableCell>No</TableCell>
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      {props.purchaseRows &&
                        props.purchaseRows.sales_returned &&
                        props.purchaseRows.sales_returned.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            <TableCell>Yes</TableCell>
                            <TableCell>{item.credit ? 'Yes' : 'No'}</TableCell>
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      {props.purchaseRows &&
                        props.purchaseRows.credited_sales &&
                        props.purchaseRows.credited_sales.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            <TableCell>No</TableCell>
                            <TableCell>Yes</TableCell>
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      {props.relationshipRows &&
                        props.relationshipRows.sales &&
                        props.relationshipRows.sales.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            <TableCell>No</TableCell>
                            <TableCell>No</TableCell>
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      {props.relationshipRows &&
                        props.relationshipRows.sales_returned &&
                        props.relationshipRows.sales_returned.map(
                          (item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.part_name}</TableCell>
                              <TableCell align='right'>
                                {
                                  new Date(item.date)
                                    .toISOString()
                                    .split('T')[0]
                                }
                              </TableCell>
                              <TableCell>Yes</TableCell>
                              <TableCell>
                                {item.credit ? 'Yes' : 'No'}
                              </TableCell>
                              <TableCell align='right'>{item.price}</TableCell>
                            </TableRow>
                          ),
                        )}
                      {props.relationshipRows &&
                        props.relationshipRows.credited_sales &&
                        props.relationshipRows.credited_sales.map(
                          (item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.part_name}</TableCell>
                              <TableCell align='right'>
                                {
                                  new Date(item.date)
                                    .toISOString()
                                    .split('T')[0]
                                }
                              </TableCell>
                              <TableCell>No</TableCell>
                              <TableCell>Yes</TableCell>
                              <TableCell align='right'>{item.price}</TableCell>
                            </TableRow>
                          ),
                        )}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          <TableRow className={classes.rowBgColor}>
            <TableCell className={classes.cellBold}>
              <span>
                <IconButton
                  aria-label='expand row'
                  size='small'
                  onClick={() => setReturnedOpen(!returnedOpen)}
                >
                  {returnedOpen ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </span>
              {props.purchaseRows && 'Returned'}
              {props.relationshipRows && 'Purchased'}
            </TableCell>
            <TableCell
              className={
                props.purchaseRows ? classes.headCellError : classes.cellBold
              }
              align='right'
            >
              {props.purchaseRows && props.purchaseRows.sales_returned_total}
              {props.relationshipRows && props.relationshipRows.purchased_total}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.cellPadding} colSpan={2}>
              <Collapse in={returnedOpen} timeout='auto' unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant='h6' gutterBottom component='div'>
                    Items
                  </Typography>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.cellBold}>
                          {props.purchaseRows && 'Part Name'}
                          {props.relationshipRows && 'Purchase Name'}
                        </TableCell>
                        <TableCell className={classes.cellBold} align='right'>
                          Date
                        </TableCell>
                        <TableCell className={classes.cellBold} align='right'>
                          Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.purchaseRows &&
                        (props.purchaseRows.sales_returned ? (
                          props.purchaseRows.sales_returned.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{item.part_name}</TableCell>
                              <TableCell align='right'>
                                {
                                  new Date(item.date)
                                    .toISOString()
                                    .split('T')[0]
                                }
                              </TableCell>
                              <TableCell align='right'>{item.price}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colspan={3}>No data found</TableCell>
                          </TableRow>
                        ))}
                      {props.relationshipRows &&
                        (props.relationshipRows.purchases ? (
                          props.relationshipRows.purchases.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                {item.company_name} - {item.vehicle_name}
                              </TableCell>
                              <TableCell align='right'>
                                {
                                  new Date(item.date)
                                    .toISOString()
                                    .split('T')[0]
                                }
                              </TableCell>
                              <TableCell align='right'>{item.price}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colspan={3}>No data found</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          {props.purchaseRows && (
            <>
              <TableRow className={classes.rowBgColor}>
                <TableCell className={classes.cellBold}>
                  <span>
                    <IconButton
                      aria-label='expand row'
                      size='small'
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
                <TableCell className={classes.headCellError} align='right'>
                  {props.purchaseRows &&
                    props.purchaseRows.credited_sales_total}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.cellPadding} colSpan={2}>
                  <Collapse in={creditedOpen} timeout='auto' unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                      <Typography variant='h6' gutterBottom component='div'>
                        Items
                      </Typography>
                      <Table size='small' aria-label='purchases'>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.cellBold}>
                              Part Name
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align='right'
                            >
                              Date
                            </TableCell>
                            <TableCell
                              className={classes.cellBold}
                              align='right'
                            >
                              Price
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {props.purchaseRows &&
                            (props.purchaseRows.credited_sales ? (
                              props.purchaseRows.credited_sales.map(
                                (item, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>{item.part_name}</TableCell>
                                    <TableCell align='right'>
                                      {
                                        new Date(item.date)
                                          .toISOString()
                                          .split('T')[0]
                                      }
                                    </TableCell>
                                    <TableCell align='right'>
                                      {item.price}
                                    </TableCell>
                                  </TableRow>
                                ),
                              )
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3}>No data found</TableCell>
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
          {props.purchaseRows && (
            <TableRow>
              <TableCell className={classes.cellBold}>Total</TableCell>
              <TableCell
                className={
                  props.purchaseRows.total &&
                  props.purchaseRows.total.toFixed(2) > 0
                    ? classes.headCellSuccess
                    : props.purchaseRows.total &&
                      props.purchaseRows.total.toFixed(2) < 0
                    ? classes.headCellError
                    : classes.headCell
                }
                align='right'
              >
                {props.purchaseRows.total &&
                  props.purchaseRows.total.toFixed(2)}
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
            {props.isLoading ? <CircularProgress size={16} /> : 'No data found'}
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  return (
    <TableContainer className={classes.cellMargin} component={Paper}>
      <Table aria-label='spanning table'>{rows}</Table>
    </TableContainer>
  );
}
