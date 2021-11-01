import React from 'react';

import { IconButton } from '@material-ui/core';
import TablePagination from '@mui/material/TablePagination';
import Box from '@mui/material/Box';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {<FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {<KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {<KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {<LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const EnhancedTablePagination = (props) => {
  const { totalCount, pageNo, rowsPerPage, changePage, changeRowsPerPage } =
    props;

  return (
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component='div'
      count={totalCount}
      rowsPerPage={rowsPerPage}
      page={pageNo}
      onPageChange={changePage}
      onRowsPerPageChange={changeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  );
};

export default EnhancedTablePagination;
