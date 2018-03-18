import * as React from 'react';
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
  }

  export interface State {
    hasChat? : boolean
  }
}

class RightPane extends React.Component<RightPane.Props, RightPane.State> {

  componentDidMount() {

  }
  state = {
    hasChat: true
  }

  leaveRoom = () => {
	  this.setState({hasChat: !this.state.hasChat});
  }
  
  render() {
    return <div className="pane2">
        {
          this.state.hasChat ? <div className="chat-window">
            <Card className="chat">
				<div
					onClick={this.leaveRoom}
					className="close-btn">
					<CloseIcon />
				</div>
				
				<CardHeader
					title="URL Avatar"
					subtitle="Subtitle"
					avatar={<Avatar>H</Avatar>}
				/>

				<hr/>

				<div className="messages">

					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						This is some nonsensical text i'm add for testing ui. It needs to long. Like really longggggggggggggggggg. Not enough. moreeeeeeee!
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						This is some nonsensical text i'm add for testing ui.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						It needs to long. Like really longggggggggggggggggg.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble mine">
						<Avatar color="#444" icon={<SvgIconFace />} />
						Not enough. moreeeeeeee!
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						This is some nonsensical text i'm add for testing ui.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						It needs to long. Like really longggggggggggggggggg.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble mine">
						<Avatar color="#444" icon={<SvgIconFace />} />
						Not enough. moreeeeeeee!
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						This is some nonsensical text i'm add for testing ui.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						It needs to long. Like really longggggggggggggggggg.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble mine">
						<Avatar color="#444" icon={<SvgIconFace />} />
						Not enough. moreeeeeeee!
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						It needs to long. Like really longggggggggggggggggg.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble mine">
						<Avatar color="#444" icon={<SvgIconFace />} />
						Not enough. moreeeeeeee!
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						This is some nonsensical text i'm add for testing ui.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						It needs to long. Like really longggggggggggggggggg.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble mine">
						<Avatar color="#444" icon={<SvgIconFace />} />
						Not enough. moreeeeeeee!
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						It needs to long. Like really longggggggggggggggggg.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble mine">
						<Avatar color="#444" icon={<SvgIconFace />} />
						Not enough. moreeeeeeee!
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						This is some nonsensical text i'm add for testing ui.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble">
						<Avatar color="#444" icon={<SvgIconFace />} />
						It needs to long. Like really longggggggggggggggggg.
					</Chip>
					<Chip style={{margin: 4}} className="chat-bubble mine">
						<Avatar color="#444" icon={<SvgIconFace />} />
						Not enough. moreeeeeeee!
					</Chip>
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);