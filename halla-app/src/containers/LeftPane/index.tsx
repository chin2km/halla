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
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import { TextBox } from '../../components';

import './style.less';

const customContentStyle = {
	width: '400px',
	maxWidth: '400px',
};

export namespace LeftPane {
	export interface Props extends RouteComponentProps<void> {
		rooms?: any[]
	}

	export interface State {
	}
}

class LeftPane extends React.Component<LeftPane.Props, LeftPane.State> {

	state = {
		open: false,
		searchWord: ""
	};
	
	handleCreateClick = () => {
		this.setState({open: true});
	};

	handleClose = () => {
		this.setState({open: false});
	};

	setSearch = ({target:{value}}) => {
		this.setState({searchWord: value})
	}
	
	render() {

		const actions = [
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
			  onClick={this.handleClose}
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
				<List>
					{R.map(({name}) => <ListItem
						className="list-item"
						key={name}
						primaryText={name}
						leftAvatar={<Avatar>{R.pipe(R.head, R.toUpper)(name)}</Avatar>}
						rightIcon={<CommunicationChatBubble />}
					/>)(filteredRooms)}
					
					{R.isEmpty(filteredRooms) && 
						<ListItem
						className="list-item"
						primaryText={"No channels found"}/>
					}
				</List>
				<Divider />
			</div>

			<Dialog
				title="Create a room"
				actions={actions}
				modal={true}
				contentStyle={customContentStyle}
				open={this.state.open}
				>
				<TextBox
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
]