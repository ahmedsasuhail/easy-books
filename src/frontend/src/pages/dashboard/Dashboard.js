import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Grid, Paper, Typography } from "@material-ui/core";
import { IconButton } from "@material-ui/core";

import { structure } from "../../components/Sidebar/Sidebar";

import useStyles from "./styles";

const Dashboard = () => {
  const classes = useStyles();

  useEffect(() => {
    document.title = `Dashboard | ${
      process.env.REACT_APP_NAME || "Easy Books"
    }`;
  }, []);

  const dashboardItems = structure.map((item, index) => {
    return (
      item.display && (
        <Grid item={true} xs={6} lg={4} key={"dashboardItem" + index}>
          <Link to={item.link} className={classes.noUnderline}>
            <Paper className={classes.paper}>
              <IconButton color="primary" component="span" size="small">
                {item.icon}
              </IconButton>
              <Typography variant="h6" component="h6">
                {item.label}
              </Typography>
            </Paper>
          </Link>
        </Grid>
      )
    );
  });

  return (
    <Grid container className={classes.pageContainer}>
      {dashboardItems}
    </Grid>
  );
};

export default Dashboard;
