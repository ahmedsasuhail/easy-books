import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

import Themes from './themes';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import store from './store/Store.js';
import { LayoutProvider } from './context/LayoutContext';

ReactDOM.render(
  <LayoutProvider>
    <Provider store={store}>
      <ThemeProvider theme={Themes.default}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </LayoutProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
