import React, { useState } from "react";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchBar from "material-ui-search-bar";

const EnhancedTableToolbar = (props) => {
  const [searched, setSearched] = useState("");

  const requestSearch = (value) => {
    props.onRequestSearch(value);
  };

  const cancelSearch = () => {
    setSearched("");
    requestSearch(null);
  };

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
        {props.title}
      </Typography>
      <SearchBar
        value={searched}
        onChange={(searchVal) => requestSearch(searchVal)}
        onCancelSearch={() => cancelSearch()}
      />
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
