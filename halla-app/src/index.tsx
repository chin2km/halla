import "rxjs/Rx";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { store , history } from "./store";
import App from "./containers/App";

ReactDOM.render(
	<Provider store={store}>
		<MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
			<Router history={history}>
				<Switch>
				<Route path="/" component={App} />
				</Switch>
			</Router>
		</MuiThemeProvider>
	</Provider>,
	document.getElementById("root")
);