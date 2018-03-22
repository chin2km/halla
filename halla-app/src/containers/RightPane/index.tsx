import * as React from 'react';
import * as R from 'ramda';
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
  }

  export interface State {
    hasChat? : boolean
  }
}

class RightPane extends React.Component<RightPane.Props, RightPane.State> {

  componentDidMount() {

  }

  leaveRoom = () => {
	  this.setState({hasChat: !this.state.hasChat});
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

				<h3 className="label"><i>Users in this room</i></h3>

				<div className="room-users">
					{chatRoom.users && R.map((user: any) =>
						<Chip key={user.username}>
							<Avatar color="#444" icon={<SvgIconFace />} />
							{user.username}
						</Chip>)(chatRoom.users)
					}
				</div>

				<hr/>

				<div className="messages">
					{
						messages && R.map(message => <Chip key={message.message} style={{margin: 4}} className="chat-bubble">
							<Avatar color="#444" icon={<SvgIconFace />} />
							<div>
								<h5>{message.user}</h5>
								<h4>{message.message}</h4>
							</div>
						</Chip>,messages)
					}
				</div>

				<div className="footer">
					<TextBox
						className="chat-input"
						hintText="type here to chat"
						multiLine={true}
						rows={2}
						fullWidth={true}
						rowsMax={4}
					/>
					<FloatingActionButton
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
	  chatRoom: state.chatRoom
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);