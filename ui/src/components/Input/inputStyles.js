import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  textField: {
    borderBottomColor: theme.palette.background.light,
  },
  textFieldUnderline: {
    '&:before': {
      borderBottomColor: theme.palette.primary.light,
    },
    '&:after': {
      borderBottomColor: theme.palette.primary.main,
    },
    '&:hover:before': {
      borderBottomColor: `${theme.palette.primary.light} !important`,
    },
  },
}));
