import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Grid, Button, makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";

import PageTitle from "../../components/PageTitle/PageTitle";
import Dialog from "../../components/Dialog/Dialog";
import CustomTable from "../../components/Table/CustomTable";

import CreateUpdateSales from "./CreateUpdateSales";
import MessageDialogue from "../../components/Dialog/MessageDialogue";

import {
  salesCreate,
  salesUpdate,
  salesDelete,
  salesRead,
} from "../../store/actions/sales";
import { inventoryPurchaseActions } from "../../store/actions/inventory_purchase/inventoryPurchaseActions";

import { formattedDate } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    [theme.breakpoints.up("lg")]: {
      width: "80%",
      margin: "auto",
    },
  },
}));

const ReadSales = () => {
  let rows = [];
  const headCells = [
    {
      id: "sn",
      label: "SN",
      disableSort: true,
    },
    {
      id: "purchase_name",
      label: "Purchase Name",
      sortName: "purchases.company_name",
    },
    {
      id: "purchase_id",
      display: false,
    },
    {
      id: "part_name",
      label: "Part Name",
      sortName: "inventory.part_name",
    },
    {
      id: "inventory_id",
      display: false,
    },
    {
      id: "inventory_quantity",
      display: false,
    },
    {
      id: "buyer",
      label: "Buyer",
      sortName: "relationships.name",
    },
    {
      id: "relationship_id",
      display: false,
    },
    {
      id: "quantity",
      label: "Quantity",
      disableSort: true,
    },
    {
      id: "price",
      label: "Price",
    },
    {
      id: "date",
      label: "Date",
    },
    {
      id: "returned",
      label: "Returned",
      checkbox: true,
      disableSort: true,
    },
    {
      id: "credit",
      display: false,
    },
    {
      id: "credit_name",
      label: "Credit",
      disableSort: true,
    },
  ];

  const dispatch = useDispatch();

  const classes = useStyles();

  const [openCreateUpdateSales, setOpenCreateUpdateSales] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [openConfirmReturnModal, setOpenConfirmReturnModal] = useState(false);
  const [valueForm, setValueForm] = useState(null);
  const [id, setId] = useState("");
  const [clearSearch, setClearSearch] = useState(false);
  const [originalQuantity, setOriginalQuantity] = useState();

  const token = useSelector((state) => state.user.token);
  const salesItems = useSelector((state) => state.sales.sales);
  const pageNo = useSelector((state) => state.sales.pageNo);
  const rowsPerPage = useSelector((state) => state.sales.rowsPerPage);
  const orderBy = useSelector((state) => state.sales.orderBy);
  const order = useSelector((state) => state.sales.order);
  const totalCount = useSelector((state) => state.sales.count);
  const query = useSelector((state) => state.sales.query);
  const isLoading = useSelector((state) => state.sales.formLoading);

  if (salesItems) {
    rows = salesItems.map((sale, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: sale.id,
        purchase_name: sale.purchases.id
          ? `${sale.purchases.company_name} - ${sale.purchases.vehicle_name}`
          : "Not Specified",
        purchase_id: sale.purchases.id ? sale.purchases.id : "Not Specified",
        part_name: sale.inventory.id
          ? sale.inventory.part_name
          : "Not Specified",
        inventory_id: sale.inventory.id ? sale.inventory.id : "Not Specified",
        inventory_quantity: sale.inventory.quantity
          ? sale.inventory.quantity
          : null,
        buyer: sale.relationships.id
          ? sale.relationships.name
          : "Not Specified",
        relationship_id: sale.relationships.id
          ? sale.relationships.id
          : "Not Specified",
        quantity: sale.quantity ? sale.quantity : "Not Specified",
        price: sale.price ? sale.price : "Not Specified",
        date: sale.date ? formattedDate(sale.date) : "Not Specified",
        returned: sale.returned ? true : false,
        credit: sale.credit,
        credit_name: sale.credit ? "Yes" : "No",
      };
    });
  }

  useEffect(() => {
    document.title = `Sales | ${process.env.REACT_APP_NAME || "Easy Books"}`;
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch(
      salesRead({
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
      salesRead({
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
      salesRead({
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
      salesRead({
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

  const handleOpenCreateSales = () => {
    setOpenCreateUpdateSales(true);
  };

  const handleConfirmDeleteModal = (bool) => {
    setOpenConfirmDeleteModal(bool);
  };

  const handleConfirmReturnModal = (bool) => {
    setOpenConfirmReturnModal(bool);
  };

  const handleOpenEditSales = (values) => {
    setValueForm(values);
    setOriginalQuantity(values.quantity);
    setOpenCreateUpdateSales(true);
  };

  const handleSubmitResult = (result) => {
    if (result) {
      let pageNumber =
        totalCount % rowsPerPage === 1 &&
        totalCount > rowsPerPage &&
        pageNo === Math.floor(totalCount / rowsPerPage)
          ? pageNo - 1
          : pageNo;

      dispatch(salesDelete({ id, token })).then((res) => {
        if (res) {
          handleChangePage(null, pageNumber);
        }
      });
    }
    handleConfirmDeleteModal(false);
  };

  const handleCloseCreateOrEditSales = () => {
    setValueForm(null);
    setOpenCreateUpdateSales(false);
    dispatch(inventoryPurchaseActions.inventoryPurchaseClear());
  };

  const handleSubmitCreateUpdateSales = (formValues) => {
    if (formValues && originalQuantity) {
      if (originalQuantity > formValues.quantity) {
        formValues.inventoryQuantity =
          valueForm.inventory_quantity +
          (originalQuantity - formValues.quantity);
      } else {
        formValues.inventoryQuantity =
          valueForm.inventory_quantity -
          (formValues.quantity - originalQuantity);
      }
    }
    if (formValues && formValues.date)
      formValues.date = new Date(formValues.date).toISOString();
    if (formValues && formValues.id) {
      dispatch(salesUpdate({ formValues, token }));
    } else {
      setClearSearch(true);
      dispatch(salesCreate({ formValues, token }));
    }
    handleCloseCreateOrEditSales();
  };

  const handleSubmitDeleteSales = (id) => {
    setId(id);
    handleConfirmDeleteModal(true);
  };

  const handleSubmitReturn = (result) => {
    if (result) {
      handleSubmitCreateUpdateSales({
        id: valueForm.id,
        purchase_id: +valueForm.purchase_id,
        inventory_id: +valueForm.inventory_id,
        relationship_id: +valueForm.relationship_id,
        price: +valueForm.price,
        date: valueForm.date,
        credit: valueForm.credit && valueForm.credit,
        quantity: +valueForm.quantity,
        inventoryQuantity: +valueForm.inventory_quantity,
        returned: valueForm.returned,
      });
    }
    handleConfirmReturnModal(false);
  };

  const handleSubmitReturnSales = (value) => {
    setValueForm(value);
    handleConfirmReturnModal(true);
  };

  return (
    <>
      <Box className={classes.pageContainer}>
        <PageTitle
          title={"Sales"}
          button={
            <Button
              variant="outlined"
              size="medium"
              color="secondary"
              onClick={handleOpenCreateSales}
            >
              Add Sales
            </Button>
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomTable
              tableTitle="All Sales"
              pageNo={pageNo}
              rowsPerPage={rowsPerPage}
              order={order}
              orderBy={orderBy}
              headCells={headCells}
              rows={rows}
              totalCount={totalCount}
              requestSort={handleRequestSort}
              changePage={handleChangePage}
              changeRowsPerPage={handleChangeRowsPerPage}
              requestSearch={handleRequestSearch}
              clearSearch={clearSearch}
              actions={true}
              openEditFunction={handleOpenEditSales}
              submitDeleteFunction={handleSubmitDeleteSales}
              submitReturnFunction={handleSubmitReturnSales}
              size="medium"
            />
          </Grid>
        </Grid>
      </Box>
      <Dialog
        title={`${valueForm ? "Edit" : "Create"} Sales`}
        fullWidth={true}
        maxWidth="sm"
        initialValues={valueForm}
        isLoading={isLoading}
        open={openCreateUpdateSales}
        handleClose={handleCloseCreateOrEditSales}
        handleSubmit={handleSubmitCreateUpdateSales}
      >
        <CreateUpdateSales initialValues={valueForm} />
      </Dialog>
      <MessageDialogue
        title="Confirm"
        message="Are you sure you want to delete this sales item?"
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
        openModal={openConfirmDeleteModal}
        handleCloseModal={() => handleConfirmDeleteModal(false)}
      />
      <MessageDialogue
        title="Confirm"
        message={`Are you sure you want to ${
          valueForm && valueForm.returned ? "return" : "unreturn"
        } this sales item?`}
        button={
          <>
            <Button
              size="small"
              onClick={() => handleSubmitReturn(false)}
              color="primary"
            >
              No
            </Button>
            <Button
              size="small"
              onClick={() => handleSubmitReturn(true)}
              color="secondary"
            >
              Yes
            </Button>
          </>
        }
        openModal={openConfirmReturnModal}
        handleCloseModal={() => handleConfirmReturnModal(false)}
      />
    </>
  );
};

export default ReadSales;
