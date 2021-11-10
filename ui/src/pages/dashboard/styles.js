import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  pageContainer: {
    [theme.breakpoints.up('lg')]: {
      width: '80%',
      margin: 'auto',
    },
  },
  paper: {
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  noUnderline: {
    textDecoration: 'none',
  },
  icon: {
    color: '#1976D2',
  },
}));
