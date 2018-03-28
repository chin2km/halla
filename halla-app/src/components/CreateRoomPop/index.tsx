import * as React from "react";
import Dialog from "material-ui/Dialog";
import { TextBox } from "..";
import FlatButton from "material-ui/FlatButton";
import { deepPurple500 } from "material-ui/styles/colors";
import CircularProgress from "material-ui/CircularProgress";

import "./style.less";

const customContentStyle = {
	width: "400px",
	maxWidth: "400px",
};

export namespace CreateRoomPopTypes {
  export interface Props {
    open: boolean;
    createRoom: Function;
    handleClose: () => void;
    loading: boolean;
  }
}

class CreateRoomPopClass extends React.Component<CreateRoomPopTypes.Props> {

	constructor (props) {
		super(props);
	}

	state = {
		newRoomName: ""
	};


	setNewRoomName = ({target: {value}}) => {
		this.setState({newRoomName: value});
	}

	handleCreate = () => {
		this.props.createRoom(this.state.newRoomName);
	};

	render () {

		const modalActions = [
				<FlatButton
					label="Cancel"
					primary={true}
					style={{color: deepPurple500}}
					onClick={this.props.handleClose}
				/>,
				<FlatButton
					label="Create"
					primary={true}
					style={{color: deepPurple500}}
					onClick={this.handleCreate}
				/>,
			];

		return (
			<Dialog
			title="Create a room"
			actions={modalActions}
			modal={true}
			contentStyle={customContentStyle}
			open={this.props.open}
			>
			<TextBox
			onChange={this.setNewRoomName}
			value={this.state.newRoomName}
			className={"search-box"}
			hintText="type a name for the room"
			/>

			 {this.props.loading && <CircularProgress size={60} thickness={7} color={deepPurple500}/>}

		</Dialog>
		);
	}
}


export const CreateRoomPop = CreateRoomPopClass;