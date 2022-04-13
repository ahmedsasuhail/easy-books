import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";

import CustomTable from "../../components/Table/CustomTable";

import { getInventoryPurchase } from "../../store/actions/inventory_purchase";
import { inventoryActions } from "../../store/actions/inventory/inventoryActions";

import { formattedDate } from "../../utils/helpers";

const InventoryModal = (props) => {
  const {
    id,
    inventoryItems,
    openInventoryModal,
    handleCloseInventoryModal,
    handleSetInventoryName,
  } = props;

  let rows = [];
  const headCells = [
    {
      id: "id",
      label: "ID",
      display: false,
    },
    {
      id: "part_name",
      label: "Part Name",
    },
    {
      id: "quantity",
      label: "Quantity",
    },
    {
      id: "date",
      label: "Date",
    },
  ];

  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const pageNo = useSelector((state) => state.inventoryPurchase.pageNo);
  const rowsPerPage = useSelector(
    (state) => state.inventoryPurchase.rowsPerPage
  );
  const orderBy = useSelector((state) => state.inventoryPurchase.orderBy);
  const order = useSelector((state) => state.inventoryPurchase.order);
  const totalCount = useSelector((state) => state.inventoryPurchase.count);

  if (inventoryItems) {
    rows = inventoryItems.map((inventory, idx) => {
      return {
        sn: pageNo === 0 ? idx + 1 : rowsPerPage * pageNo + (idx + 1),
        id: inventory.id,
        part_name: inventory.part_name ? inventory.part_name : "Not Specified",
        quantity: inventory.quantity && inventory.quantity,
        date: inventory.date ? formattedDate(inventory.date) : "Not Specified",
      };
    });
  }

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    const direction = isAsc ? "desc" : "asc";
    dispatch(
      getInventoryPurchase({
        id,
        token,
        pageNo,
        rowsPerPage,
        order: direction,
        orderBy: property,
      })
    );
  };

  const handleChangePage = (_event, newPage) => {
    dispatch(
      getInventoryPurchase({
        id,
        token,
        pageNo: newPage,
        rowsPerPage,
        orderBy,
        order,
      })
    );
  };

  const handleChangeRowsPerPage = (event) => {
    dispatch(
      getInventoryPurchase({
        id,
        token,
        pageNo,
        rowsPerPage: parseInt(event.target.value, 10),
        orderBy,
        order,
      })
    );
  };

  useEffect(() => {
    dispatch(inventoryActions.inventoryReadClear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    handleChangePage(null, pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={openInventoryModal}
      onClose={handleCloseInventoryModal}
    >
      <DialogTitle id="max-width-dialog-title">Inventory</DialogTitle>
      <DialogContent>
        <CustomTable
          tableTitle="All Inventory"
          order={order}
          orderBy={orderBy}
          requestSort={handleRequestSort}
          headCells={headCells}
          rows={rows}
          totalCount={totalCount}
          pageNo={pageNo}
          rowsPerPage={rowsPerPage}
          changePage={handleChangePage}
          changeRowsPerPage={handleChangeRowsPerPage}
          actions={true}
          submitAddFunction={handleSetInventoryName}
          size="small"
        />
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default InventoryModal;
