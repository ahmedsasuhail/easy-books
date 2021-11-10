import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { Drawer, IconButton, List } from '@material-ui/core';
import {
  ArrowBack as ArrowBackIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Contacts as ContactsIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
} from '@material-ui/icons';
import { useTheme } from '@material-ui/styles';

import classNames from 'classnames';

import useStyles from './styles';

import SidebarLink from './components/SidebarLink/SidebarLink';

import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from '../../context/LayoutContext';

export const structure = [
  {
    id: 0,
    label: 'Dashboard',
    link: '/app/dashboard',
    icon: <DashboardIcon />,
  },
  {
    id: 1,
    type: 'divider',
  },
  {
    id: 2,
    label: 'Reports',
    link: '/app/reports',
    icon: <AssessmentIcon />,
    display: true,
  },
  {
    id: 3,
    type: 'divider',
  },
  {
    id: 4,
    label: 'Purchases',
    link: '/app/purchases',
    icon: <AccountBalanceWalletIcon />,
    display: true,
  },
  {
    id: 5,
    label: 'Inventory',
    link: '/app/inventory',
    icon: <ShoppingCartIcon />,
    display: true,
  },
  {
    id: 6,
    label: 'Sales',
    link: '/app/sales',
    icon: <AccountBalanceWalletIcon />,
    display: true,
  },
  { id: 7, type: 'divider' },
  {
    id: 8,
    label: 'Miscellaneous',
    link: '/app/miscellaneous',
    icon: <AccountBalanceWalletIcon />,
    display: true,
  },
  {
    id: 9,
    label: 'Relationships',
    link: '/app/relationships',
    icon: <ContactsIcon />,
    display: true,
  },
];

function Sidebar({ location }) {
  var classes = useStyles();
  var theme = useTheme();

  var { isSidebarOpened } = useLayoutState();
  var layoutDispatch = useLayoutDispatch();

  var [isPermanent, setPermanent] = useState(true);

  useEffect(function () {
    window.addEventListener('resize', handleWindowWidthChange);
    handleWindowWidthChange();
    return function cleanup() {
      window.removeEventListener('resize', handleWindowWidthChange);
    };
  });

  return (
    <Drawer
      variant={isPermanent ? 'permanent' : 'temporary'}
      className={classNames(classes.drawer, {
        [classes.drawerOpen]: isSidebarOpened,
        [classes.drawerClose]: !isSidebarOpened,
      })}
      classes={{
        paper: classNames({
          [classes.drawerOpen]: isSidebarOpened,
          [classes.drawerClose]: !isSidebarOpened,
        }),
      }}
      open={isSidebarOpened}
    >
      <div className={classes.toolbar} />
      <div className={classes.mobileBackButton}>
        <IconButton onClick={() => toggleSidebar(layoutDispatch)}>
          <ArrowBackIcon
            classes={{
              root: classNames(classes.headerIcon, classes.headerIconCollapse),
            }}
          />
        </IconButton>
      </div>
      <List className={classes.sidebarList}>
        {structure.map((link) => (
          <SidebarLink
            key={link.id}
            location={location}
            isSidebarOpened={isSidebarOpened}
            {...link}
          />
        ))}
      </List>
    </Drawer>
  );

  // ##################################################################
  function handleWindowWidthChange() {
    var windowWidth = window.innerWidth;
    var breakpointWidth = theme.breakpoints.values.md;
    var isSmallScreen = windowWidth < breakpointWidth;

    if (isSmallScreen && isPermanent) {
      setPermanent(false);
    } else if (!isSmallScreen && !isPermanent) {
      setPermanent(true);
    }
  }
}

export default withRouter(Sidebar);
