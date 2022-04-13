import React, { useState, useEffect } from "react";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { TextField, IconButton } from "@material-ui/core";
import { Search as SearchIcon, Close as CloseIcon } from "@material-ui/icons";

const EnhancedTableToolbar = (props) => {
  const { title, onRequestSearch, clearSearch } = props;

  const [searched, setSearched] = useState("");

  const requestSearch = () => {
    onRequestSearch(searched);
  };

  const cancelSearch = () => {
    onRequestSearch("");
  };

  useEffect(() => {
    if (clearSearch) {
      setSearched("");
    }
  }, [clearSearch]);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {title}
      </Typography>
      <TextField
        id="query"
        name="query"
        type="text"
        margin="normal"
        placeholder="Search"
        value={searched}
        onChange={(e) => setSearched(e.target.value)}
      />
      <IconButton
        onClick={() => requestSearch()}
        color="primary"
        component="span"
        size="small"
      >
        <SearchIcon fontSize="small" />
      </IconButton>
      {searched && (
        <IconButton
          onClick={() => {
            setSearched("");
            cancelSearch();
          }}
          color="primary"
          component="span"
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
