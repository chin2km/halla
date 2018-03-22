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
	  channel?: any;
  }

  export interface State {
    hasChat? : boolean
  }
}

class RightPane extends React.Component<RightPane.Props, RightPane.State> {

  componentDidMount() {

  }
  state = {
    hasChat: false
  }

  leaveRoom = () => {
	  this.setState({hasChat: !this.state.hasChat});
  }
  
  render() {
	  const {channel} = this.props;
	  const {messages} = channel;
    return <div className="pane2">
        {
          this.state.hasChat ? <div className="chat-window">
            <Card className="chat">
				{/* <div
					onClick={this.leaveRoom}
					className="close-btn">
					<CloseIcon />
				</div> */}
				
				<CardHeader
					title={channel.name}
					subtitle={channel.created.toString()}
					avatar={<Avatar>{R.pipe(R.head, R.toUpper)(channel.name)}</Avatar>}
				/>

				<hr/>

				<div className="messages">
					{
						R.map(message => <Chip key={message.message} style={{margin: 4}} className="chat-bubble">
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
		  <CommunicationChatBubble onClick={this.leaveRoom} className="chat-panel-icon" />
        }
    </div>;
  }
}

function mapStateToProps(state: RootState) {
  return {
	  channel: currentChannel
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);

const currentChannel = {
	name: 'MyChannel',
	created: new Date(),
	messages: [
		{user: "a user", message: 'A messaga sde', time: new Date()},
		{user: "1 user", message: 'A messaa sdge', time: new Date()},
		{user: "auser", message: 'A messagsd asde. this is a reallr really really really really really really really really really really really really message really really really really really really really really really really really really really really really really reallymesage', time: new Date()},
		{user: "a usaser", message: 'A mes asdasd sage', time: new Date()},
		{user: "a usfer", message: 'A message', time: new Date()},
		{user: "a usser", message: 'A mesasd asdsage', time: new Date()},
		{user: "a ussaer", message: 'A mess asdasd asdage', time: new Date()},
		{user: "a asuser", message: 'A mess asdage', time: new Date()},
		{user: "a uadser", message: 'A message AS', time: new Date()},
		{user: "a usder", message: 'A messa asd adge', time: new Date()},
		{user: "aasd uasser", message: 'A m asdas asessage sda', time: new Date()},
		{user: "a asduser", message: 'A mesd asdds sage', time: new Date()},
	]
}