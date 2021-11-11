import React from 'react';

import useStyles from './styles';

import { Typography } from '../Wrappers';

export default function PageTitle(props) {
  var classes = useStyles();

  return (
    <div className={classes.pageTitleContainer}>
      <Typography className={classes.typo} variant='h1' size='sm'>
        {props.title}
      </Typography>
      {props.button}
    </div>
  );
}
