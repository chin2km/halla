import * as React from "react";
import { Redirect } from "react-router";
import {
	Route
} from "react-router-dom";

import "./style.less";

export namespace PrivateRoute {
	export interface Props {
		path: string;
		authenticated: Boolean;
		component: any;
	}
}

export class PrivateRoute extends React.Component<PrivateRoute.Props> {
	render () {
		const { component: Component, authenticated, ...rest } = this.props;
		return (
			<Route
				{...rest}
				render={(props) => authenticated === true
				? <Component {...props} />
				: <Redirect to={{pathname: "/login", state: {from: props.location}}} />}
			/>
		);
	}
}