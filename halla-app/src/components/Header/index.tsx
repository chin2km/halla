import * as React from "react";
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
			<h1>{title}</h1>
		</div>
		);
	}
}
