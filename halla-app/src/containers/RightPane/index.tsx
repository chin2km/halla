import * as React from 'react';
import * as classname from 'classnames';
import * as R from 'ramda';
import * as moment from 'moment';
import * as ChatRoomActions from '../../actions/Chatroom'
import { RouteComponentProps } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../reducers';
import {deepPurple500} from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Chip from 'material-ui/Chip';
import SvgIconFace from 'material-ui/svg-icons/action/face';
import SendIcon from 'material-ui/svg-icons/content/send';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { TextBox } from '../../components';

import './style.less';

export namespace RightPane {
  export interface Props extends RouteComponentProps<void> {
		chatRoom?: any;
		userId?: string;
		actions?: typeof ChatRoomActions
  }

  export interface State {
  }
}

class RightPane extends React.Component<RightPane.Props, RightPane.State> {
	state = {
		messageToSend: ""
	}
	scrollAnchor = undefined;

	componentDidMount() {
    	this.scrollToBottom();
	}

	componentDidUpdate() {
		this.scrollToBottom();
	}

	scrollToBottom() {
		if(this.scrollAnchor) {
		this.scrollAnchor.scrollIntoView({ behavior: 'smooth' });
		}
	}

	setScrollAnchor = (ref) => {
		this.scrollAnchor = ref;
	}


	setMessageToSend = ({target: {value}}) => {
		this.setState({messageToSend: value});
	}

	sendMessageHandle = () => {
		if(R.trim(this.state.messageToSend)) {
			this.setState({messageToSend: ""});
			this.props.actions.sendMessageToRoom(this.state.messageToSend);
		}
	}

	render() {
		const {chatRoom} = this.props;
		const {messages} = chatRoom;
	return <div className="pane2">
		{
			!R.isEmpty(chatRoom) ? <div className="chat-window">
			<Card className="chat">

				<CardHeader
					title={chatRoom.title}
					subtitle={`Room admin: ${chatRoom.admin}`}
					avatar={<Avatar>{R.pipe(R.head, R.toUpper)(chatRoom.title)}</Avatar>}
				/>

				<h3 className="label"><i>Active users in this room..</i></h3>

				<div className="room-users">
					{chatRoom.users && R.map((user: any) =>
						<Chip key={user.username}>
							<Avatar color="#444" icon={<SvgIconFace />} />
							{user.username}
						</Chip>)(chatRoom.users)
					}
				</div>

				<hr/>

				<div className="messages" >
					{
						messages &&
						R.map(message => {
							const clazz = classname("chat-bubble", {mine: R.equals(this.props.userId, message.userId)})
							return <Chip key={message.message} style={{margin: 4}} className={clazz}>
							<Avatar color="#444" icon={<SvgIconFace />} />
							<div>
								<h5>{message.username}</h5>
								<h5 title={message.time}>{moment(message.time).fromNow()}</h5>
								<h4>{message.message}</h4>
							</div>
						</Chip>
						}, messages)
					}
					<div ref={this.setScrollAnchor}></div>
				</div>

				<div className="footer">
					<TextBox
						onChange={this.setMessageToSend}
						value={this.state.messageToSend}
						className="chat-input"
						hintText="type message here"
						multiLine={true}
						rows={2}
						fullWidth={true}
						rowsMax={4}
					/>
					<FloatingActionButton
						onClick={this.sendMessageHandle}
						data-tip="Send to room"
						backgroundColor={deepPurple500}
						className="send-button">
						<SendIcon />
					</FloatingActionButton>
				</div>

			</Card>
			</div> :
			<CommunicationChatBubble className="chat-panel-icon" />
		}
	</div>;
	}
}

function mapStateToProps(state: RootState) {
  return {
	  chatRoom: state.chatRoom,
	  userId: state.auth.user._id
  };
}

function mapDispatchToProps(dispatch) {
  return {
		actions: bindActionCreators(ChatRoomActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);