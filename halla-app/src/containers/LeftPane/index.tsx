import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {deepPurple500, deepPurple600, deepPurple50} from 'material-ui/styles/colors';
import {Tabs, Tab} from 'material-ui/Tabs';
import { EntityList, CreateRoomPop, withSpinner } from '../../components';
import * as RoomsListActions from '../../actions/RoomsList'
import * as ChatRoomActions from '../../actions/Chatroom'
import * as PeopleListActions from '../../actions/peopeList'

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

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.actions.fetchRooms();
		this.props.actions.fetchPeople();
	}
	
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
							handleClose={this.props.actions.closeCreateRoom}
							createRoom={this.props.actions.createRoom}
						/>
						<FloatingActionButton
							onClick={this.props.actions.openCreateRoom}
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
						entities={[]}
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
			...bindActionCreators(PeopleListActions as any, dispatch),
			...bindActionCreators(ChatRoomActions as any, dispatch)
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(withSpinner(LeftPane));