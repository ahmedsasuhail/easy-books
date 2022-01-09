import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Grid, Button, makeStyles } from "@material-ui/core";
import Box from "@mui/material/Box";

import PageTitle from "../../components/PageTitle/PageTitle";
import Dialog from "../../components/Dialog/Dialog";
import CustomTable from "../../components/Table/CustomTable";

import CreateUpdateMiscellaneous from "./CreateUpdateMiscellaneous";
import MessageDialogue from "../../components/Dialog/MessageDialogue";

import {
  miscellaneousRead,
  miscellaneousCreate,
  miscellaneousUpdate,
  miscellaneousDelete,
} from "../../store/actions/miscellaneous";

import { formattedDate } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  pageContainer: {
    [theme.breakpoints.up("lg")]: {
      width: "80%",
      margin: "auto",
    },
  },
}));

const ReadMiscellaneous = () => {
  let rows = [];
  const headCells = [
    {
      id: "sn",
      label: "SN",
      disableSort: true,
    },
    {
      id: "description",
      label: "Description",
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
  ];

  const dispatch = useDispatch();

  const classes = useStyles();

  const [openCreateUpdateMiscellaneous, setOpenCreateUpdateMiscellaneous] =
    useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [valueForm, setValueForm] = useState(null);
  const [id, setId] = useState("");
  const [clearSearch, setClearSearch] = useState(false);

  const token = useSelector((state) => state.user.token);
  const miscellaneousItems = useSelector(
    (state) => state.miscellaneous.miscellaneous
  );
  const pageNo = useSelector((state) => state.miscellaneous.pageNo);
  const rowsPerPage = useSelector((state) => state.miscellaneous.rowsPerPage);
  const orderBy = useSelector((state) => state.miscellaneous.orderBy);
  const order = useSelector((state) => state.miscellaneous.order);
  const totalCount = useSelector((state) => state.miscellaneous.count);
  const query = useSelector((state) => state.miscellaneous.query);
  const isLoading = useSelector((state) => state.miscellaneous.formLoading);

  if (miscellaneousItems) {
    rows = miscellaneousItems.map((miscellaneous, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: miscellaneous.id,
        description: miscellaneous.description
          ? miscellaneous.description
          : "Not Specified",
        price: miscellaneous.price ? miscellaneous.price : "Not Specified",
        date: miscellaneous.date
          ? formattedDate(miscellaneous.date)
          : "Not Specified",
      };
    });
  }

  useEffect(() => {
    document.title = `Miscellaneous | ${
      process.env.REACT_APP_NAME || "Easy Books"
    }`;
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch(
      miscellaneousRead({
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
      miscellaneousRead({
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
      miscellaneousRead({
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
      miscellaneousRead({
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

  const handleOpenCreateMiscellaneous = () => {
    setOpenCreateUpdateMiscellaneous(true);
  };

  const handleConfirmModal = (bool) => {
    setOpenConfirmModal(bool);
  };

  const handleOpenEditMiscellaneous = (values) => {
    setValueForm(values);
    setOpenCreateUpdateMiscellaneous(true);
  };

  const handleSubmitResult = (result) => {
    if (result) {
      let pageNumber =
        totalCount % rowsPerPage === 1 &&
        totalCount > rowsPerPage &&
        pageNo === Math.floor(totalCount / rowsPerPage)
          ? pageNo - 1
          : pageNo;

      dispatch(miscellaneousDelete({ id, token })).then((res) => {
        if (res) {
          handleChangePage(null, pageNumber);
        }
      });
    }
    handleConfirmModal(false);
  };

  const handleCloseCreateOrEditMiscellaneous = () => {
    setValueForm(null);
    setOpenCreateUpdateMiscellaneous(false);
  };

  const handleSubmitCreateUpdateMiscellaneous = (formValues) => {
    formValues.date = new Date(formValues.date).toISOString();
    if (formValues.id) {
      dispatch(
        miscellaneousUpdate({
          formValues,
          token,
        })
      );
    } else {
      setClearSearch(true);
      dispatch(
        miscellaneousCreate({
          formValues,
          token,
        })
      );
    }
    handleCloseCreateOrEditMiscellaneous();
  };

  const handleSubmitDeleteMiscellaneous = (id) => {
    setId(id);
    handleConfirmModal(true);
  };

  return (
    <>
      <Box className={classes.pageContainer}>
        <PageTitle
          title={"Miscellaneous"}
          button={
            <Button
              variant="outlined"
              size="medium"
              color="secondary"
              onClick={handleOpenCreateMiscellaneous}
            >
              Add Miscellaneous
            </Button>
          }
        />
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <CustomTable
              tableTitle="All Miscellaneous"
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
              openEditFunction={handleOpenEditMiscellaneous}
              submitDeleteFunction={handleSubmitDeleteMiscellaneous}
              size="medium"
            />
          </Grid>
        </Grid>
      </Box>
      <Dialog
        title={`${valueForm ? "Edit" : "Create"} Miscellaneous`}
        fullWidth={true}
        maxWidth="sm"
        initialValues={valueForm}
        isLoading={isLoading}
        open={openCreateUpdateMiscellaneous}
        handleClose={handleCloseCreateOrEditMiscellaneous}
        handleSubmit={handleSubmitCreateUpdateMiscellaneous}
      >
        <CreateUpdateMiscellaneous />
      </Dialog>
      <MessageDialogue
        title="Confirm"
        message="Are you sure you want to delete this miscellaneous item?"
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
    </>
  );
};

export default ReadMiscellaneous;
