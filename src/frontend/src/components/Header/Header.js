import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppBar, Toolbar, IconButton, Menu } from "@material-ui/core";
import {
  Menu as MenuIcon,
  Person as AccountIcon,
  ArrowBack as ArrowBackIcon,
} from "@material-ui/icons";

import classNames from "classnames";

import useStyles from "./styles";

import { Typography } from "../Wrappers";

import {
  useLayoutState,
  useLayoutDispatch,
  toggleSidebar,
} from "../../context/LayoutContext";

import { userLogout } from "../../store/actions/user";

export default function Header() {
  var classes = useStyles();

  var layoutState = useLayoutState();
  var layoutDispatch = useLayoutDispatch();
  const dispatch = useDispatch();

  var [profileMenu, setProfileMenu] = useState(null);

  const userName = useSelector((state) => state.user.name);
  const userEmail = useSelector((state) => state.user.email);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          color="inherit"
          onClick={() => toggleSidebar(layoutDispatch)}
          className={classNames(
            classes.headerMenuButtonSandwich,
            classes.headerMenuButtonCollapse
          )}
        >
          {layoutState.isSidebarOpened ? (
            <ArrowBackIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse
                ),
              }}
            />
          ) : (
            <MenuIcon
              classes={{
                root: classNames(
                  classes.headerIcon,
                  classes.headerIconCollapse
                ),
              }}
            />
          )}
        </IconButton>
        <Typography variant="h6" weight="medium" className={classes.logotype}>
          {process.env.REACT_APP_NAME || "Easy Books"}
        </Typography>
        <div className={classes.grow} />
        <IconButton
          aria-haspopup="true"
          color="inherit"
          className={classes.headerMenuButton}
          aria-controls="profile-menu"
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <AccountIcon classes={{ root: classes.headerIcon }} />
        </IconButton>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          className={classes.headerMenu}
          classes={{ paper: classes.profileMenu }}
          disableAutoFocusItem
        >
          <div className={classes.profileMenuUser}>
            <Typography variant="h4" weight="medium">
              {userName}
            </Typography>
            <Typography
              className={classes.profileMenuLink}
              component="a"
              color="primary"
              href={`mailto:${userEmail}`}
            >
              {userEmail}
            </Typography>
          </div>
          <div className={classes.profileMenuUser}>
            <Typography
              className={classes.profileMenuLink}
              color="primary"
              onClick={() => dispatch(userLogout())}
            >
              Sign Out
            </Typography>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
