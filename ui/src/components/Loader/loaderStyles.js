import { makeStyles } from '@material-ui/styles';

export default makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.snackbar + 1,
    color: '#fff',
  },
}));
