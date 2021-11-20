import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Grid, Paper, Typography, Button } from "@material-ui/core";

import logo from "../../assets/images/logo.svg";

import classnames from "classnames";

import useStyles from "./styles";

export default function Error() {
  var classes = useStyles();

  useEffect(() => {
    document.title = `Error | ${process.env.REACT_APP_NAME || "Easy Books"}`;
  }, []);

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotype}>
        <img className={classes.logotypeIcon} src={logo} alt="logo" />
        <Typography variant="h3" className={classes.logotypeText}>
          {process.env.REACT_APP_NAME || "Easy Books"}
        </Typography>
      </div>
      <Paper classes={{ root: classes.paperRoot }}>
        <Typography
          variant="h1"
          color="primary"
          className={classnames(classes.textRow, classes.errorCode)}
        >
          404
        </Typography>
        <Typography variant="h5" color="primary" className={classes.textRow}>
          Oops. Looks like the page you're looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          size="large"
          className={classes.backButton}
        >
          Back to Home
        </Button>
      </Paper>
    </Grid>
  );
}
