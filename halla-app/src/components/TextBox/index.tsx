import * as React from "react";
import TextField from "material-ui/TextField";
import { deepPurple500 } from "material-ui/styles/colors";

const colorScheme = {
	color: deepPurple500,
};

const underlineColor = {
	borderColor: deepPurple500,
};

export namespace TextField {
	export interface Props {
	}
	export interface State {
	}
}

export class TextBox extends React.Component<any, TextField.State> {
	render () {
		return (
			<TextField
				hintStyle={colorScheme}
				underlineFocusStyle={underlineColor}
				{...this.props}
			/>
		);
	}
}

