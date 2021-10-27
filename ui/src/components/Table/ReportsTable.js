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
              {props.rows.company_name} - {props.rows.vehicle_name}
            </TableCell>
            <TableCell
              style={{ color: 'white', fontWeight: 'bold' }}
              align='right'
            >
              {props.rows.price}
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
            <TableCell
              style={{ fontWeight: 900, color: '#4BB543' }}
              align='right'
            >
              {props.rows.sales_total + props.rows.sales_returned_total}
            </TableCell>
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
                        <TableCell>Part Name</TableCell>
                        <TableCell align='right'>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.rows.sales &&
                        props.rows.sales.map((item) => (
                          <TableRow>
                            <TableCell>{item.part_name}</TableCell>
                            <TableCell align='right'>{item.price}</TableCell>
                          </TableRow>
                        ))}
                      {props.rows.sales_returned.map((item) => (
                        <TableRow>
                          <TableCell>{item.part_name}</TableCell>
                          <TableCell align='right'>{item.price}</TableCell>
                        </TableRow>
                      ))}
                      {/* <TableRow>
                        <TableCell>Item name 1</TableCell>
                        <TableCell align='right'>100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Item name 2</TableCell>
                        <TableCell align='right'>200</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Item name 3</TableCell>
                        <TableCell align='right'>300</TableCell>
                      </TableRow> */}
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
            <TableCell style={{ fontWeight: 'bold' }}>Returned</TableCell>
            <TableCell
              style={{ fontWeight: 900, color: '#ff0000' }}
              align='right'
            >
              -{props.rows.sales_returned_total}
            </TableCell>
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
                        <TableCell>Part Name</TableCell>
                        <TableCell align='right'>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {props.rows.sales_returned.map((item) => (
                        <TableRow>
                          <TableCell>{item.part_name}</TableCell>
                          <TableCell align='right'>{item.price}</TableCell>
                        </TableRow>
                      ))}
                      {/* <TableRow>
                        <TableCell>Item name 1</TableCell>
                        <TableCell align='right'>100</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Item name 2</TableCell>
                        <TableCell align='right'>200</TableCell>
                      </TableRow> */}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell />
            <TableCell style={{ fontWeight: 900 }}>Total</TableCell>
            <TableCell
              style={{ fontWeight: 900, color: '#ff0000' }}
              align='right'
            >
              {props.rows.total.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </>
    );
  } else {
    rows = <TableCell>No data found</TableCell>;
  }

  return (
    <TableContainer style={{ marginTop: '15px' }} component={Paper}>
      <Table aria-label='spanning table'>{rows}</Table>
    </TableContainer>
  );
}
