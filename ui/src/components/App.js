import React from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from './Layout';

import Error from '../pages/error';
import Login from '../pages/login';

export default function App() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  return (
    <HashRouter>
      <Switch>
        <Route exact path='/' render={() => <Redirect to='/app/dashboard' />} />
        <Route
          exact
          path='/app'
          render={() => <Redirect to='/app/dashboard' />}
        />
        <PrivateRoute path='/app' component={Layout} />
        <PublicRoute path='/login' component={Login} />
        <Route component={Error} />
      </Switch>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}
