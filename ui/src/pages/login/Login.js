import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  TextField,
  Fade,
} from '@material-ui/core';
import { withRouter } from 'react-router-dom';

// styles
import useStyles from './styles';

// logo
import logo from './logo.svg';

// redux
import { userLogin } from '../../store/actions/user';

function Login(props) {
  var classes = useStyles();

  // local
  var [loginValue, setLoginValue] = useState('john.doe@example.com');
  var [passwordValue, setPasswordValue] = useState('password');

  var isLoading = useSelector((state) => state.user.loading);
  var error = useSelector((state) => state.user.messageType);
  const dispatch = useDispatch();

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt='logo' className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Easy Books</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Typography variant='h1' className={classes.greeting}>
            Good Day!
          </Typography>
          <div className={classes.formDividerContainer}></div>
          <Fade in={error}>
            <Typography color='secondary' className={classes.errorMessage}>
              Something is wrong with your login or password :(
            </Typography>
          </Fade>
          <TextField
            id='email'
            InputProps={{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              },
            }}
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
            margin='normal'
            placeholder='Email Adress'
            type='email'
            fullWidth
          />
          <TextField
            id='password'
            InputProps={{
              classes: {
                underline: classes.textFieldUnderline,
                input: classes.textField,
              },
            }}
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            margin='normal'
            placeholder='Password'
            type='password'
            fullWidth
          />
          <div className={classes.formButtons}>
            {isLoading ? (
              <CircularProgress size={26} className={classes.loginLoader} />
            ) : (
              <Button
                disabled={loginValue.length === 0 || passwordValue.length === 0}
                onClick={() =>
                  dispatch(userLogin(loginValue, passwordValue, props.history))
                }
                variant='contained'
                color='primary'
                size='large'
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
