import React from 'react';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const EnhancedTableToolbar = (props) => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant='h6'
        id='tableTitle'
        component='div'
      >
        {props.title}
      </Typography>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
