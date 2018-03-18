import * as React from 'react';
import * as R from 'ramda';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import SplitterLayout from 'react-splitter-layout';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {deepPurple500} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import { TextBox, RoomsList } from '../../components';
import * as RoomsListActions from '../../actions/RoomsList';


import './style.less';

const customContentStyle = {
	width: '400px',
	maxWidth: '400px',
};

export namespace LeftPane {
	export interface Props extends RouteComponentProps<void> {
		rooms?: any[],
		actions?: typeof RoomsListActions
	}

	export interface State {
	}
}

class LeftPane extends React.Component<LeftPane.Props, LeftPane.State> {

	state = {
		open: false,
		searchWord: "",
		newRoomName: ""
	};
	
	handleCreateClick = () => {
		this.setState({open: true});
	};

	handleClose = () => {
		this.setState({open: false, newRoomName: ""});
	};

	handleCreate = () => {
		this.props.actions.createRoom(this.state.newRoomName);
	};

	setNewRoomName = ({target:{value}}) => {
		this.setState({newRoomName: value});
	}

	setSearch = ({target:{value}}) => {
		this.setState({searchWord: value})
	}
	
	render() {
		const modalActions = [
			<FlatButton
			  label="Cancel"
			  primary={true}
			  style={{color: deepPurple500}}
			  onClick={this.handleClose}
			/>,
			<FlatButton
			  label="Create"
			  primary={true}
			  style={{color: deepPurple500}}
			  onClick={this.handleCreate}
			/>,
		];

		const filteredRooms = R.filter(R.propSatisfies(
			R.contains(this.state.searchWord),
			'name'
		), this.props.rooms)

		return <div className="pane1">
			<div className="fixed">
				<h2>Rooms</h2>
				<FloatingActionButton
					onClick={this.handleCreateClick}
					data-tip="Create a room"
					backgroundColor={deepPurple500}
					mini={true}
					className="add-button">
					<ContentAdd />
				</FloatingActionButton>
				<TextBox
					className={"search-box"}
					onChange={this.setSearch}
					hintText="Search rooms"
				/>
			</div>

			<div className="scrolled">
				<RoomsList rooms={filteredRooms}/>
			</div>

			<Dialog
				title="Create a room"
				actions={modalActions}
				modal={true}
				contentStyle={customContentStyle}
				open={this.state.open}
				>
				<TextBox
					onChange={this.setNewRoomName}
					value={this.state.newRoomName}
					className={"search-box"}
					hintText="type a name for the room"
				/>
			</Dialog>
							
	</div>;
	}
}

function mapStateToProps(state: RootState) {
	return {
		rooms: dummyChannels
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(RoomsListActions as any, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);

const dummyChannels = [
	{name: 'abc-rooooom'},
	{name: 'def-rooooom'},
	{name: 'ghi-rooooom'},
	{name: 'jkl-rooooom'},
	{name: 'mno-rooooom'},
	{name: 'pqr-rooooom'},
	{name: 'stu-rooooom'},
	{name: 'vwx-rooooom'},
	{name: 'abc-roooooom'},
	{name: 'def-roooooom'},
	{name: 'ghi-roooooom'},
	{name: 'jkl-roooooom'},
	{name: 'mno-roooooom'},
	{name: 'pqr-roooooom'},
	{name: 'stu-roooooom'},
	{name: 'vwx-roooooom'},
	{name: 'abc-roooioom'},
	{name: 'def-roooioom'},
	{name: 'ghi-roooioom'},
	{name: 'jkl-roooioom'},
	{name: 'mno-roooioom'},
	{name: 'pqr-roooioom'},
	{name: 'stu-roooioom'},
	{name: 'vwx-roooioom'},
]