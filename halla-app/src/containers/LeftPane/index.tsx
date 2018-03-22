import * as React from 'react';
import * as R from 'ramda';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import SplitterLayout from 'react-splitter-layout';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {deepPurple500, deepPurple600, deepPurple50} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import { TextBox, EntityList, CreateRoomPop } from '../../components';
import * as RoomsListActions from '../../actions/RoomsList'
import * as ChatRoomActions from '../../actions/Chatroom'

import './style.less';


export namespace LeftPane {
	export interface Props extends RouteComponentProps<void> {
		rooms?: any[],
		actions?: any
		componentsStates?: any
	}

	export interface State {
	}
}

class LeftPane extends React.Component<LeftPane.Props, LeftPane.State> {

	state = {
		open: false,
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

	
	render() {

		return <div className="pane1">
 				<Tabs
					className="tab-system"
				 	initialSelectedIndex={0}
                    tabItemContainerStyle={{
						color: deepPurple600,
						backgroundColor: 'transparent',
					}}
                    inkBarStyle={{background: deepPurple50}}>
                    <Tab
                        icon={<br/>}
                        label="Rooms">

						<EntityList
							label="rooms"						
							entities={this.props.rooms}
							onItemClick={this.props.actions.joinRoom}>
							<CreateRoomPop
								loading={this.props.componentsStates.loading}
								open={this.props.componentsStates.open}
								handleClose={this.handleClose}
								createRoom={this.props.actions.createRoom}
							/>
							<FloatingActionButton
								onClick={this.handleCreateClick}
								data-tip="Create a room"
								backgroundColor={deepPurple500}
								className="add-button">
								<ContentAdd />
							</FloatingActionButton>
						</EntityList>
                    </Tab>
                    <Tab
                        icon={<br />}
                        label="People">

						<EntityList
							label="people"
							entities={this.props.rooms}
							onItemClick={this.props.actions.joinRoom}
						/>
                    </Tab>
                </Tabs>
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
		actions: {
			...bindActionCreators(RoomsListActions as any, dispatch),
			...bindActionCreators(ChatRoomActions as any, dispatch)
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);