import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import classnames from 'classnames';

// styles
import useStyles from './styles';

// components
import Header from '../Header';
import Sidebar from '../Sidebar';
import Loader from '../Loader/Loader';

// pages
import Dashboard from '../../pages/dashboard';
import Typography from '../../pages/typography';
import Notifications from '../../pages/notifications';
import Maps from '../../pages/maps';
import Icons from '../../pages/icons';
import Charts from '../../pages/charts';
import Miscellaneous from '../../pages/miscellaneous/ReadMiscellaneous';
import Purchases from '../../pages/purchases/ReadPurchase';
import Sales from '../../pages/sales/ReadSales';
import Inventory from '../../pages/inventory/ReadInventory';
import Relationships from '../../pages/relationships/ReadRelationships';

// context
import { useLayoutState } from '../../context/LayoutContext';

import { miscellaneousRead } from '../../store/actions/miscellaneous';
import { relationshipRead } from '../../store/actions/relationship';
import { purchaseRead } from '../../store/actions/purchase';
import { inventoryRead } from '../../store/actions/inventory';
import { salesRead } from '../../store/actions/sales';

function Layout(props) {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const isMiscellaneousLoading = useSelector(
    (state) => state.miscellaneous.pageLoading,
  );
  const isRelationshipLoading = useSelector(
    (state) => state.relationship.pageLoading,
  );
  const isPurchaseLoading = useSelector((state) => state.purchase.pageLoading);
  const isInventoryLoading = useSelector(
    (state) => state.inventory.pageLoading,
  );
  const isSalesLoading = useSelector((state) => state.sales.pageLoading);

  useEffect(() => {
    dispatch(miscellaneousRead({ token: token }));
    dispatch(relationshipRead({ token: token }));
    dispatch(purchaseRead({ token: token }));
    dispatch(inventoryRead({ token: token }));
    dispatch(salesRead({ token: token }));
  }, [dispatch, token]);

  var classes = useStyles(
    isMiscellaneousLoading,
    isRelationshipLoading,
    isPurchaseLoading,
  );

  // global
  var layoutState = useLayoutState();

  return (
    <>
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
        <>
          <Header history={props.history} />
          <Sidebar />
          <div
            className={classnames(classes.content, {
              [classes.contentShift]: layoutState.isSidebarOpened,
            })}
          >
            <div className={classes.fakeToolbar} />
            <Switch>
              <Route path='/app/dashboard' component={Dashboard} />
              <Route path='/app/typography' component={Typography} />
              <Route path='/app/notifications' component={Notifications} />
              <Route path='/app/miscellaneous' component={Miscellaneous} />
              <Route path='/app/purchases' component={Purchases} />
              <Route path='/app/sales' component={Sales} />
              <Route path='/app/inventory' component={Inventory} />
              <Route path='/app/relationships' component={Relationships} />
              <Route
                exact
                path='/app/ui'
                render={() => <Redirect to='/app/ui/icons' />}
              />
              <Route path='/app/ui/maps' component={Maps} />
              <Route path='/app/ui/icons' component={Icons} />
              <Route path='/app/ui/charts' component={Charts} />
            </Switch>
          </div>
        </>
      </div>
    </>
  );
}

export default withRouter(Layout);
