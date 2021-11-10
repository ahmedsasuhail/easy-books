import React, { useEffect, useState, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Contacts as ContactsIcon,
} from '@material-ui/icons';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';

import SpanningTable from '../../components/Table/Reports/ReportsTable';

import { mergeObjects } from '../../utils/helpers';
import axios from '../../utils/axiosInstance';

import { userActions } from '../../store/actions/user/userActions';

import useStyles from './styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Reports = () => {
  const classes = useStyles();

  const userDispatch = useDispatch();

  const [value, setValue] = useState(0);

  const token = useSelector((state) => state.user.token);
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );

  const initialState = {
    purchaseRows: {},
    relationshipRows: {},
    isLoading: false,
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'LOADING':
        return mergeObjects(state, {
          isLoading: true,
        });
      case 'PURCHASES':
        return mergeObjects(state, {
          purchaseRows: action.payload,
          isLoading: false,
        });
      case 'RELATIONSHIPS':
        return mergeObjects(state, {
          relationshipRows: action.payload,
          isLoading: false,
        });
      case 'CLEAR':
        return {
          purchaseRows: {},
          relationshipRows: {},
          isLoading: false,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.title = `Dashboard | ${process.env.REACT_APP_NAME}`;
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    dispatch({ type: 'CLEAR' });
  };

  const handlePurchasesChange = async (event) => {
    const id = event.target.value;
    dispatch({ type: 'LOADING' });
    try {
      const response = await axios.post(
        'reports/by_purchase',
        { purchase_id: +id },
        { headers: { Authorization: token } },
      );
      if (response.data.data) {
        dispatch({ type: 'PURCHASES', payload: response.data.data });
      } else {
        console.log('Error: ', response);
        dispatch({ type: 'CLEAR' });
      }
    } catch (error) {
      console.log('Catch Error: ', error);
      dispatch({ type: 'CLEAR' });
      if (error.response && error.response.status === 401) {
        userDispatch(userActions.logoutUser());
      }
    }
  };

  const handleRelationshipsChange = async (event) => {
    const id = event.target.value;
    dispatch({ type: 'LOADING' });
    try {
      const response = await axios.post(
        'reports/by_relationship',
        { relationship_id: +id },
        { headers: { Authorization: token } },
      );
      if (response.data.data) {
        dispatch({ type: 'RELATIONSHIPS', payload: response.data.data });
      } else {
        console.log('Error: ', response);
        dispatch({ type: 'CLEAR' });
      }
    } catch (error) {
      console.log('Catch Error: ', error);
      dispatch({ type: 'CLEAR' });
      if (error.response && error.response.status === 401) {
        userDispatch(userActions.logoutUser());
      }
    }
  };

  return (
    <Box className={classes.pageContainer}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label='icon label tabs example'
        >
          <Tab
            icon={<AccountBalanceWalletIcon />}
            label='PURCHASES'
            {...a11yProps(0)}
          />
          <Tab
            icon={<ContactsIcon />}
            label='RELATIONSHIPS'
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <FormControl className={classes.dropdownWidth}>
          <InputLabel variant='standard' htmlFor='uncontrolled-native'>
            Purchases
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: 'purchases',
              id: 'uncontrolled-native',
            }}
            onChange={(e) => handlePurchasesChange(e, 'PURCHASES')}
          >
            <option value=''></option>
            {purchaseItems &&
              purchaseItems.map((item) => {
                return (
                  <option
                    key={item.id}
                    value={item.id}
                  >{`${item.company_name} - ${item.vehicle_name}`}</option>
                );
              })}
          </NativeSelect>
        </FormControl>
        <SpanningTable
          isLoading={state.isLoading}
          purchaseRows={state.purchaseRows}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FormControl className={classes.dropdownWidth}>
          <InputLabel variant='standard' htmlFor='uncontrolled-native'>
            Relationships
          </InputLabel>
          <NativeSelect
            inputProps={{
              name: 'relationships',
              id: 'uncontrolled-native',
            }}
            onChange={(e) => handleRelationshipsChange(e, 'RELATIONSHIPS')}
          >
            <option value=''></option>
            {relationshipItems &&
              relationshipItems.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
          </NativeSelect>
        </FormControl>
        <SpanningTable
          isLoading={state.isLoading}
          relationshipRows={state.relationshipRows}
        />
      </TabPanel>
    </Box>
  );
};

export default Reports;
