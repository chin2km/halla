import 'rxjs/Rx';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {cyan500} from 'material-ui/styles/colors';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { store , history} from './store';
import {AppContainer} from 'react-hot-loader';
import * as AUTH_ACTIONS from './actions/auth'
import App from './containers/App';

ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <Router history={history}>
            <Switch>
              <Route path='/' component={App} />
            </Switch>
        </Router>
      </MuiThemeProvider>
    </Provider>,
  document.getElementById('root')
);