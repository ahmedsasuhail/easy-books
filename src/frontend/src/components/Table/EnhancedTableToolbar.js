import React, { useState } from "react";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SearchBar from "material-ui-search-bar";

const EnhancedTableToolbar = (props) => {
  const [searched, setSearched] = useState("");

  const requestSearch = () => {
    props.onRequestSearch(searched);
  };

  const cancelSearch = () => {
    setSearched("");
    props.onRequestSearch("");
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          requestSearch();
        }}
      >
        <SearchBar
          id="search"
          value={searched}
          onChange={(searchVal) => setSearched(searchVal)}
          onCancelSearch={cancelSearch}
        />
      </form>
    </Toolbar>
  );
};

export default EnhancedTableToolbar;
