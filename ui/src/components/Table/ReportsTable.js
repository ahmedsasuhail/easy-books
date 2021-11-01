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

export default function SpanningTable(props) {
  const [open, setOpen] = React.useState(false);
  let rows;

  if (!!props.rows.id) {
    rows = (
      <>
        <TableHead
          style={{
            backgroundColor: '#7D6EE7',
          }}
        >
          <TableRow>
            <TableCell />
            <TableCell style={{ color: 'white', fontWeight: 'bold' }}>
              {props.rows.name && props.rows.name}
              {props.rows.company_name &&
                props.rows.vehicle_name &&
                `${props.rows.company_name} - ${props.rows.vehicle_name}`}
            </TableCell>
            <TableCell
              style={{ color: 'white', fontWeight: 'bold' }}
              align='right'
            >
              {props.rows.price && props.rows.price}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow style={{ backgroundColor: '#F5F5F5' }}>
            <TableCell>
              <IconButton
                aria-label='expand row'
                size='small'
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>Sales</TableCell>
            {!props.rows.purchased_total && (
              <TableCell
                style={{ fontWeight: 900, color: '#4BB543' }}
                align='right'
              >
                {!props.rows.purchased_total &&
                  props.rows.sales_total + props.rows.sales_returned_total}
              </TableCell>
            )}
            {props.rows.purchased_total && (
              <TableCell style={{ fontWeight: 900 }} align='right'>
                {props.rows.sales_total}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
              <Collapse in={open} timeout='auto' unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant='h6' gutterBottom component='div'>
                    Items
                  </Typography>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: '900' }}>
                          Part Name
                        </TableCell>
                        <TableCell style={{ fontWeight: '900' }} align='right'>
                          Date
                        </TableCell>
                        {props.rows.purchased_total && (
                          <TableCell style={{ fontWeight: '900' }}>
                            Returned
                          </TableCell>
                        )}
                        <TableCell style={{ fontWeight: '900' }} align='right'>
                          Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.rows.sales &&
                        props.rows.sales.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            {props.rows.purchased_total && (
                              <TableCell>No</TableCell>
                            )}
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      {props.rows.sales_returned &&
                        props.rows.sales_returned.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            {props.rows.purchased_total && (
                              <TableCell>Yes</TableCell>
                            )}
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          <TableRow style={{ backgroundColor: '#F5F5F5' }}>
            <TableCell>
              <IconButton
                aria-label='expand row'
                size='small'
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell style={{ fontWeight: 'bold' }}>
              {props.rows.sales_returned ? 'Returned' : 'Purchased'}
            </TableCell>
            {!props.rows.purchased_total && (
              <TableCell
                style={{ fontWeight: 900, color: '#ff0000' }}
                align='right'
              >
                -
                {props.rows.sales_returned_total &&
                  props.rows.sales_returned_total}
              </TableCell>
            )}
            {props.rows.purchased_total && (
              <TableCell style={{ fontWeight: 900 }} align='right'>
                {props.rows.purchased_total}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
              <Collapse in={open} timeout='auto' unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant='h6' gutterBottom component='div'>
                    Items
                  </Typography>
                  <Table size='small' aria-label='purchases'>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: '900' }}>
                          Part Name
                        </TableCell>
                        <TableCell style={{ fontWeight: '900' }} align='right'>
                          Date
                        </TableCell>
                        <TableCell style={{ fontWeight: '900' }} align='right'>
                          Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.rows.sales_returned &&
                        props.rows.sales_returned.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      {props.rows.purchases &&
                        props.rows.purchases.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell>
                              {item.company_name} - {item.vehicle_name}
                            </TableCell>
                            <TableCell align='right'>
                              {new Date(item.date).toISOString().split('T')[0]}
                            </TableCell>
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          {!props.rows.purchased_total && (
            <TableRow>
              <TableCell />
              <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
              <TableCell
                style={{ fontWeight: 900, color: '#ff0000' }}
                align='right'
              >
                {props.rows.total && props.rows.total.toFixed(2)}
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
          <TableCell>No data found</TableCell>
        </TableRow>
      </TableHead>
    );
  }

  return (
    <TableContainer style={{ marginTop: '15px' }} component={Paper}>
      <Table aria-label='spanning table'>{rows}</Table>
    </TableContainer>
  );
}
