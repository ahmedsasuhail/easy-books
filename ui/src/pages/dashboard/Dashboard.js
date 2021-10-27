import React, { useEffect, useState, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Contacts as ContactsIcon,
} from '@material-ui/icons';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';

import SpanningTable from '../../components/Table/ReportsTable';

import { mergeObjects } from '../../utils/helpers';
import axios from '../../utils/axiosInstance';

import { userActions } from '../../store/actions/user/userActions';

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships,
  );
  const userDispatch = useDispatch();

  const initialState = {
    purchaseRows: {},
    relationshipRows: {},
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'PURCHASES':
        return mergeObjects(state, {
          purchaseRows: action.payload,
        });
      case 'RELATIONSHIPS':
        return mergeObjects(state, {
          relationshipRows: action.payload,
        });
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.title = `Dashboard | ${process.env.REACT_APP_NAME}`;
  }, []);

  const [value, setValue] = useState(0);

  const token = useSelector((state) => state.user.token);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handlePurchasesChange = async (event, actionType) => {
    const id = event.target.value;
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
        return false;
      }
    } catch (error) {
      console.log('Error: ', error);
      if (error.response && error.response.status === 401) {
        userDispatch(userActions.logoutUser());
      }
    }
  };

  const handleRelationshipsChange = async (event, actionType) => {
    const id = event.target.value;
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
        return false;
      }
    } catch (error) {
      console.log('Error: ', error);
      if (error.response && error.response.status === 401) {
        userDispatch(userActions.logoutUser());
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
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
        <FormControl>
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
            {purchaseItems.map((item) => {
              return (
                <option
                  value={item.id}
                >{`${item.company_name} - ${item.vehicle_name}`}</option>
              );
            })}
          </NativeSelect>
        </FormControl>
        <SpanningTable rows={state.purchaseRows} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <FormControl>
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
            {relationshipItems.map((item) => {
              return <option value={item.id}>{item.name}</option>;
            })}
          </NativeSelect>
        </FormControl>
        <br />
        <SpanningTable rows={state.relationshipRows} />
      </TabPanel>
    </Box>
  );
};

export default Dashboard;
