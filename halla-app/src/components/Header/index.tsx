import * as React from "react";
import { Link } from "react-router-dom";
import "./style.less";

export namespace Header {
	export interface Props {
		title: String;
	}
}

export class Header extends React.Component<Header.Props> {
	render () {
		const { title } = this.props;
		return (
		<div className="normal">
			<Link to="/">
			<h1>{title}</h1>
			</Link>
		</div>
		);
	}
}
