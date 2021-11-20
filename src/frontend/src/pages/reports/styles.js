import { makeStyles } from "@material-ui/core/styles";

export default makeStyles((theme) => ({
  dropdownWidth: {
    minWidth: "15% !important",
    marginRight: "10px !important",
  },
  pageContainer: {
    [theme.breakpoints.up("lg")]: {
      width: "80%",
      margin: "auto",
    },
  },
  formInput: {
    width: 220,
    marginRight: "10px !important",
  },
}));
