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
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import { TextBox, RoomsList, CreateRoomPop } from '../../components';
import * as RoomsListActions from '../../actions/RoomsList'

import './style.less';


export namespace LeftPane {
	export interface Props extends RouteComponentProps<void> {
		rooms?: any[],
		actions?: typeof RoomsListActions
		componentsStates?: any
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

	componentDidMount() {
		this.props.actions.fetchRooms();
	}
	
	handleCreateClick = () => {
		this.props.actions.openCreateRoom();
	};

	handleClose = () => {
		this.props.actions.closeCreateRoom();
	};

	setSearch = ({target:{value}}) => {
		this.setState({searchWord: value})
	}
	
	render() {

		const filteredRooms = R.filter(R.propSatisfies(
			R.contains(this.state.searchWord),
			'title'
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

			<CreateRoomPop
				loading={this.props.componentsStates.loading}
				open={this.props.componentsStates.open}
				handleClose={this.handleClose}
				createRoom={this.props.actions.createRoom}
			/>
	</div>;
	}
}

function mapStateToProps(state: RootState) {
	return {
		rooms: state.rooms,
		componentsStates: state.componentsStates.createRoom
	};
}

function mapDispatchToProps(dispatch) {
	return {
		actions: bindActionCreators(RoomsListActions as any, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);