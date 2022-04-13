import React, { useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";

import { Button } from "@material-ui/core";

import classnames from "classnames";

import useStyles from "./styles";

import Header from "../Header";
import Sidebar from "../Sidebar";
import Loader from "../Loader/Loader";
import MessageDialogue from "../Dialog/MessageDialogue";

import Dashboard from "../../pages/dashboard/Dashboard";
import Miscellaneous from "../../pages/miscellaneous/ReadMiscellaneous";
import Purchases from "../../pages/purchases/ReadPurchase";
import Sales from "../../pages/sales/ReadSales";
import Inventory from "../../pages/inventory/ReadInventory";
import Relationships from "../../pages/relationships/ReadRelationships";
import Reports from "../../pages/reports/Reports";

import { useLayoutState } from "../../context/LayoutContext";

import { relationshipRead } from "../../store/actions/relationship";
import { purchaseRead } from "../../store/actions/purchase";
import { inventoryRead } from "../../store/actions/inventory";
import { userLogout } from "../../store/actions/user";

function Layout() {
  var classes = useStyles();

  var layoutState = useLayoutState();

  const dispatch = useDispatch();

  const token = useSelector((state) => state.user.token);
  const isModalOpen = useSelector((state) => state.user.modelOpen);
  const message = useSelector((state) => state.user.message);

  const isMiscellaneousLoading = useSelector(
    (state) => state.miscellaneous.pageLoading
  );
  const isRelationshipLoading = useSelector(
    (state) => state.relationship.pageLoading
  );
  const isPurchaseLoading = useSelector((state) => state.purchase.pageLoading);
  const isInventoryLoading = useSelector(
    (state) => state.inventory.pageLoading
  );
  const isSalesLoading = useSelector((state) => state.sales.pageLoading);

  // useEffect(() => {
  //   dispatch(
  //     relationshipRead({
  //       token: token,
  //       pageNo: 0,
  //       rowsPerPage: 5,
  //       order: "asc",
  //       orderBy: "id",
  //       query: "",
  //     })
  //   );
  //   dispatch(
  //     purchaseRead({
  //       token: token,
  //       pageNo: 0,
  //       rowsPerPage: 5,
  //       order: "asc",
  //       orderBy: "id",
  //       query: "",
  //     })
  //   );
  //   dispatch(
  //     inventoryRead({
  //       token: token,
  //       pageNo: 0,
  //       rowsPerPage: 5,
  //       order: "asc",
  //       orderBy: "id",
  //       query: "",
  //     })
  //   );
  // }, [dispatch, token]);

  return (
    <Fragment>
      <Loader
        open={
          isMiscellaneousLoading ||
          isRelationshipLoading ||
          isPurchaseLoading ||
          isInventoryLoading ||
          isSalesLoading
        }
      />
      <div className={classes.root}>
        <Header />
        <Sidebar />
        <div
          className={classnames(classes.content, {
            [classes.contentShift]: layoutState.isSidebarOpened,
          })}
        >
          <div className={classes.fakeToolbar} />
          <Switch>
            <Route path="/app/dashboard" component={Dashboard} />
            <Route path="/app/purchases" component={Purchases} />
            <Route path="/app/inventory" component={Inventory} />
            <Route path="/app/sales" component={Sales} />
            <Route path="/app/miscellaneous" component={Miscellaneous} />
            <Route path="/app/relationships" component={Relationships} />
            <Route path="/app/reports" component={Reports} />
          </Switch>
        </div>
      </div>
      <MessageDialogue
        title="Alert"
        message={message}
        button={
          <>
            <Button
              size="small"
              onClick={() => dispatch(userLogout())}
              color="primary"
            >
              Close
            </Button>
          </>
        }
        openModal={isModalOpen}
        handleCloseModal={() => dispatch(userLogout())}
      />
    </Fragment>
  );
}

export default withRouter(Layout);
