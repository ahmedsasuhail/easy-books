import React from 'react';
import { Backdrop, CircularProgress } from '@material-ui/core';

// Styles
import useStyles from './loaderStyles';

function Loader(props) {
  const classes = useStyles();

  return (
    <div>
      <Backdrop className={classes.backdrop} open={props.open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  );
}

export default Loader;
