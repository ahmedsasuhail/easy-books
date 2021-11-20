import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(() => ({
  headBgColor: {
    backgroundColor: "#7D6EE7",
  },
  rowBgColor: {
    backgroundColor: "#F5F5F5",
  },
  cellBold: {
    fontWeight: "900 !important",
  },
  headCell: {
    fontWeight: "900 !important",
    color: "#FFFFFF !important",
  },
  headCellSuccess: {
    fontWeight: "900  !important",
    color: "#4BB543 !important",
  },
  headCellError: {
    fontWeight: "900 !important",
    color: "#ff0000 !important",
  },
  cellPadding: {
    paddingBottom: "0 !important",
    paddingTop: "0 !important",
  },
  cellMargin: {
    marginTop: "15px !important",
  },
  box: {
    margin: "8px !important",
  },
}));
