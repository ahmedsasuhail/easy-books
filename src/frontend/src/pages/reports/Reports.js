import React, { useEffect, useState, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Contacts as ContactsIcon,
  DateRange as DateRangeIcon,
} from "@material-ui/icons";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Grid } from "@material-ui/core";

import SpanningTable from "../../components/Table/Reports/ReportsTable";

import PurchasesModal from "../inventory/PurchasesModal";
import RelationshipModal from "../purchases/RelationshipModal";

import { mergeObjects } from "../../utils/helpers";
import axios from "../../utils/axiosInstance";
import { formattedDate } from "../../utils/helpers";

import { userActions } from "../../store/actions/user/userActions";

import useStyles from "./styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Reports = () => {
  const classes = useStyles();

  const userDispatch = useDispatch();

  const [value, setValue] = useState(0);
  const [fromDate, setFromDate] = useState(new Date().toISOString());
  const [toDate, setToDate] = useState(new Date().toISOString());
  const [purchaseId, setPurchaseId] = useState("");
  const [purchaseName, setPurchaseName] = useState("");
  const [relationshipId, setRelationshipId] = useState("");
  const [relationshipName, setRelationshipName] = useState("");
  const [openPurchasesModal, setOpenPurchasesModal] = useState(false);
  const [openRelationshipModal, setOpenRelationshipModal] = useState(false);

  const token = useSelector((state) => state.user.token);
  const purchaseItems = useSelector((state) => state.purchase.purchases);
  const relationshipItems = useSelector(
    (state) => state.relationship.relationships
  );

  const initialState = {
    purchaseRows: {},
    relationshipRows: {},
    rangeRows: {},
    isLoading: false,
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOADING":
        return mergeObjects(state, {
          isLoading: true,
        });
      case "PURCHASES":
        return mergeObjects(state, {
          purchaseRows: action.payload,
          isLoading: false,
        });
      case "RELATIONSHIPS":
        return mergeObjects(state, {
          relationshipRows: action.payload,
          isLoading: false,
        });
      case "RANGE":
        return mergeObjects(state, {
          rangeRows: action.payload,
          isLoading: false,
        });
      case "CLEAR":
        return {
          purchaseRows: {},
          relationshipRows: {},
          rangeRows: {},
          isLoading: false,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    document.title = `Dashboard | ${
      process.env.REACT_APP_NAME || "Easy Books"
    }`;
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    dispatch({ type: "CLEAR" });
  };

  const handlePurchasesChange = async (id) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.post(
        "reports/by_purchase",
        { purchase_id: +id },
        { headers: { Authorization: token } }
      );
      if (response.data.data) {
        dispatch({ type: "PURCHASES", payload: response.data.data });
      } else {
        console.log("Error: ", response);
        dispatch({ type: "CLEAR" });
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch({ type: "CLEAR" });
      if (error.response && error.response.status === 401) {
        userDispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };

  const handleRelationshipsChange = async () => {
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.post(
        "reports/by_relationship",
        {
          relationship_id: +relationshipId,
          date_range: `${fromDate}|${toDate}`,
        },
        { headers: { Authorization: token } }
      );
      if (response.data.data) {
        dispatch({ type: "RELATIONSHIPS", payload: response.data.data });
      } else {
        console.log("Error: ", response);
        dispatch({ type: "CLEAR" });
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch({ type: "CLEAR" });
      if (error.response && error.response.status === 401) {
        userDispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };

  const handleRangeChange = async () => {
    dispatch({ type: "LOADING" });
    try {
      const response = await axios.post(
        "reports/by_range",
        {
          date_range: `${fromDate}|${toDate}`,
        },
        { headers: { Authorization: token } }
      );
      if (response.data.data) {
        dispatch({ type: "RANGE", payload: response.data.data });
      } else {
        console.log("Error: ", response);
        dispatch({ type: "CLEAR" });
      }
    } catch (error) {
      console.log("Catch Error: ", error);
      dispatch({ type: "CLEAR" });
      if (error.response && error.response.status === 401) {
        userDispatch(userActions.userAuthFailure(error.response.data.message));
      }
    }
  };

  const headList = [
    { icon: <AccountBalanceWalletIcon />, label: "PURCHASES" },
    { icon: <ContactsIcon />, label: "RELATIONSHIPS" },
    { icon: <DateRangeIcon />, label: "RANGE" },
  ];

  const handleSetPurchaseName = (value) => {
    setPurchaseId(value.id);
    setPurchaseName(`${value.company_name} - ${value.vehicle_name}`);
    handlePurchasesChange(value.id);
    handleClosePurchasesModal();
  };

  const handleClosePurchasesModal = () => {
    setOpenPurchasesModal(false);
  };

  const handleSetRelationshipName = (value) => {
    setRelationshipId(value.id);
    setRelationshipName(value.name);
    handleCloseRelationshipModal();
  };

  const handleCloseRelationshipModal = () => {
    setOpenRelationshipModal(false);
  };

  return (
    <Box className={classes.pageContainer}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label="icon label tabs example"
        >
          {headList.map((item, idx) => (
            <Tab
              key={idx}
              icon={item.icon}
              label={item.label}
              {...a11yProps(idx)}
            />
          ))}
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <FormControl variant="standard" className={classes.dropdownWidth}>
          <InputLabel id="purchases-open-select-label">Purchases</InputLabel>
          <Select
            labelId="purchases-open-select-label"
            id="purchases-open-select"
            value={purchaseId}
            autoWidth
            disabled
          >
            <MenuItem value={purchaseId || ""}>
              {purchaseName || "None"}
            </MenuItem>
          </Select>
          <Button
            variant="text"
            onClick={() => setOpenPurchasesModal(true)}
            size="small"
            color="primary"
          >
            Add Purchase
          </Button>
        </FormControl>
        <SpanningTable
          isLoading={state.isLoading}
          purchaseRows={state.purchaseRows}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Grid container>
          <FormControl variant="standard" className={classes.dropdownWidth}>
            <InputLabel id="relationships-open-select-label">
              Relationships
            </InputLabel>
            <Select
              labelId="relationships-open-select-label"
              id="relationships-open-select"
              value={relationshipId}
              autoWidth
              disabled
            >
              <MenuItem value={relationshipId || ""}>
                {relationshipName || "None"}
              </MenuItem>
            </Select>
            <Button
              variant="text"
              onClick={() => setOpenRelationshipModal(true)}
              size="small"
              color="primary"
            >
              Add Relationship
            </Button>
          </FormControl>
          <TextField
            id="from_date"
            name="from_date"
            label="From Date"
            type="date"
            variant="standard"
            defaultValue={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFromDate(new Date(e.target.value).toISOString())
            }
            className={classes.formInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="to_date"
            name="to_date"
            label="To Date"
            type="date"
            variant="standard"
            defaultValue={new Date().toISOString().split("T")[0]}
            onChange={(e) => setToDate(new Date(e.target.value).toISOString())}
            className={classes.formInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button size="small" onClick={() => handleRelationshipsChange()}>
            Submit
          </Button>
          <SpanningTable
            isLoading={state.isLoading}
            relationshipRows={state.relationshipRows}
          />
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container>
          <TextField
            id="from_date"
            name="from_date"
            label="From Date"
            type="date"
            variant="standard"
            defaultValue={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setFromDate(new Date(e.target.value).toISOString())
            }
            className={classes.formInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="to_date"
            name="to_date"
            label="To Date"
            type="date"
            variant="standard"
            defaultValue={new Date().toISOString().split("T")[0]}
            onChange={(e) => setToDate(new Date(e.target.value).toISOString())}
            className={classes.formInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button size="small" onClick={() => handleRangeChange()}>
            Submit
          </Button>
        </Grid>
        <SpanningTable
          isLoading={state.isLoading}
          rangeRows={state.rangeRows}
          fromDate={formattedDate(fromDate).split("/").reverse().join("-")}
          toDate={formattedDate(toDate).split("/").reverse().join("-")}
        />
      </TabPanel>
      <PurchasesModal
        purchaseItems={purchaseItems}
        openPurchasesModal={openPurchasesModal}
        handleSetPurchaseName={handleSetPurchaseName}
        handleClosePurchasesModal={handleClosePurchasesModal}
      />
      <RelationshipModal
        relationshipItems={relationshipItems}
        openRelationshipModal={openRelationshipModal}
        handleSetRelationshipName={handleSetRelationshipName}
        handleCloseRelationshipModal={handleCloseRelationshipModal}
      />
    </Box>
  );
};

export default Reports;
