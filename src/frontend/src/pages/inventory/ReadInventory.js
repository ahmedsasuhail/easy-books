import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Grid, Button, makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";

import PageTitle from "../../components/PageTitle/PageTitle";
import Dialog from "../../components/Dialog/Dialog";
import CustomTable from "../../components/Table/CustomTable";
import MessageDialogue from "../../components/Dialog/MessageDialogue";

import CreateUpdateInventory from "./CreateUpdateInventory";

import {
  inventoryCreate,
  inventoryRead,
  inventoryUpdate,
  inventoryDelete,
} from "../../store/actions/inventory";

import { formattedDate } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    [theme.breakpoints.up("lg")]: {
      width: "80%",
      margin: "auto",
    },
  },
}));

const ReadInventory = () => {
  let rows = [];
  const headCells = [
    {
      id: "sn",
      label: "SN",
      disableSort: true,
    },
    {
      id: "purchase_id",
      display: false,
    },
    {
      id: "purchase_name",
      label: "Purchase Name",
      sortName: "purchases.company_name",
    },
    {
      id: "part_name",
      label: "Part Name",
    },
    {
      id: "quantity",
      label: "Quantity",
      disableSort: true,
    },
    {
      id: "date",
      label: "Date",
    },
  ];

  const dispatch = useDispatch();

  const classes = useStyles();

  const [openCreateUpdateInventory, setOpenCreateUpdateInventory] =
    useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [valueForm, setValueForm] = useState(null);
  const [id, setId] = useState("");
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [clearSearch, setClearSearch] = useState(false);

  const token = useSelector((state) => state.user.token);
  const inventoryItems = useSelector((state) => state.inventory.inventory);
  const pageNo = useSelector((state) => state.inventory.pageNo);
  const rowsPerPage = useSelector((state) => state.inventory.rowsPerPage);
  const orderBy = useSelector((state) => state.inventory.orderBy);
  const order = useSelector((state) => state.inventory.order);
  const totalCount = useSelector((state) => state.inventory.count);
  const query = useSelector((state) => state.inventory.query);
  const isLoading = useSelector((state) => state.inventory.formLoading);

  if (inventoryItems) {
    rows = inventoryItems.map((inventory, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: inventory.id,
        purchase_id: inventory.purchases.id
          ? inventory.purchases.id
          : "Not Specified",
        purchase_name: inventory.purchases.id
          ? `${inventory.purchases.company_name} - ${inventory.purchases.vehicle_name}`
          : "Not Specified",
        part_name: inventory.part_name ? inventory.part_name : "Not Specified",
        quantity: inventory.quantity && inventory.quantity,
        date: inventory.date ? formattedDate(inventory.date) : "Not Specified",
      };
    });
  }

  useEffect(() => {
    document.title = `Inventory | ${
      process.env.REACT_APP_NAME || "Easy Books"
    }`;
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch(
      inventoryRead({
        token,
        pageNo: 0,
        rowsPerPage,
        order: direction,
        orderBy: property,
        query,
      })
    );
  };

  const handleChangePage = (_event, newPage) => {
    dispatch(
      inventoryRead({
        token,
        pageNo: newPage,
        rowsPerPage,
        orderBy,
        order,
        query,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      inventoryRead({
        token,
        pageNo: 0,
        rowsPerPage: parseInt(event.target.value, 10),
        orderBy,
        order,
        query,
      })
    );
  };

  const handleRequestSearch = (value) => {
    dispatch(
      inventoryRead({
        token,
        pageNo: 0,
        rowsPerPage,
        orderBy,
        order,
        query: value,
      })
    );
  };

  useEffect(() => {
    handleChangePage(null, pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    dispatch(
      inventoryRead({
        token: token,
        pageNo: 0,
        // TODO: Change 5 below
        rowsPerPage: 2,
        order: "asc",
        orderBy: "id",
        query: "",
      })
    );
  }, []);

  const handleOpenCreateInventory = () => {
    setOpenCreateUpdateInventory(true);
  };

  const handleConfirmModal = (bool) => {
    setOpenConfirmModal(bool);
  };

  const handleOpenEditInventory = (values) => {
    setValueForm(values);
    setOpenCreateUpdateInventory(true);
  };

  const handleSubmitResult = (result) => {
    if (result) {
      let pageNumber =
        totalCount % rowsPerPage === 1 &&
        totalCount > rowsPerPage &&
        pageNo === Math.floor(totalCount / rowsPerPage)
          ? pageNo - 1
          : pageNo;

      dispatch(inventoryDelete({ id, token })).then((res) => {
        if (res) {
          handleChangePage(null, pageNumber);
        } else {
          setOpenAlertModal(true);
        }
      });
    }
    handleConfirmModal(false);
  };

  const handleCloseCreateOrEditInventory = () => {
    setValueForm(null);
    setOpenCreateUpdateInventory(false);
  };

  const handleSubmitCreateUpdateInventory = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    if (formValues.id) {
      dispatch(inventoryUpdate({ formValues, token }));
    } else {
      setClearSearch(true);
      dispatch(inventoryCreate({ formValues, token }));
    }
    handleCloseCreateOrEditInventory();
  };

  const handleSubmitDeleteInventory = (id) => {
    setId(id);
    handleConfirmModal(true);
  };

  return (
    <>
      <Box className={classes.pageContainer}>
        <PageTitle
          title={"Inventory"}
          button={
            <Button
              variant="outlined"
              size="medium"
              color="secondary"
              onClick={handleOpenCreateInventory}
            >
              Add Inventory
            </Button>
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomTable
              tableTitle="All Inventory"
              pageNo={pageNo}
              rowsPerPage={rowsPerPage}
              order={order}
              orderBy={orderBy}
              headCells={headCells}
              rows={rows}
              totalCount={totalCount}
              requestSort={handleRequestSort}
              requestSearch={handleRequestSearch}
              clearSearch={clearSearch}
              openEditFunction={handleOpenEditInventory}
              submitDeleteFunction={handleSubmitDeleteInventory}
              actions={true}
              changePage={handleChangePage}
              changeRowsPerPage={handleChangeRowsPerPage}
              size="medium"
            />
          </Grid>
        </Grid>
      </Box>
      <Dialog
        title={`${valueForm ? "Edit" : "Create"} Inventory`}
        fullWidth={true}
        maxWidth="sm"
        initialValues={valueForm}
        isLoading={isLoading}
        open={openCreateUpdateInventory}
        handleClose={handleCloseCreateOrEditInventory}
        handleSubmit={handleSubmitCreateUpdateInventory}
      >
        <CreateUpdateInventory />
      </Dialog>
      <MessageDialogue
        title="Confirm"
        message="Are you sure you want to delete this inventory item?"
        button={
          <>
            <Button
              size="small"
              onClick={() => handleSubmitResult(false)}
              color="primary"
            >
              No
            </Button>
            <Button
              size="small"
              onClick={() => handleSubmitResult(true)}
              color="secondary"
            >
              Yes
            </Button>
          </>
        }
        openModal={openConfirmModal}
        handleCloseModal={() => handleConfirmModal(false)}
      />
      <MessageDialogue
        title="Alert"
        message="Cannot delete this item."
        button={
          <>
            <Button
              size="small"
              onClick={() => setOpenAlertModal(false)}
              color="primary"
            >
              Close
            </Button>
          </>
        }
        openModal={openAlertModal}
        handleCloseModal={() => setOpenAlertModal(false)}
      />
    </>
  );
};

export default ReadInventory;
