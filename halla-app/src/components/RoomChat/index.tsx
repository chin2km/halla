import * as React from "react";
import * as R from "ramda";
import * as classname from "classnames";
import { deepPurple500 } from "material-ui/styles/colors";
import * as moment from "moment";
import SvgIconFace from "material-ui/svg-icons/action/face";
import SendIcon from "material-ui/svg-icons/content/send";
import { TextBox } from "../../components";
import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import { Card, CardHeader } from "material-ui/Card";
import FloatingActionButton from "material-ui/FloatingActionButton";

import "./style.less";

export namespace RoomChat {
	export interface Props {
		chatRoom?: any;
		userId?: any;
		sendMessage: Function;
		directChat: Function;
	}
}

export class RoomChat extends React.Component<RoomChat.Props> {

	state = {
		messageToSend: ""
	};
	scrollAnchor = undefined;

	componentDidMount () {
		this.scrollToBottom();
	}

	componentDidUpdate () {
		this.scrollToBottom();
	}

	scrollToBottom () {
		if (this.scrollAnchor) {
		this.scrollAnchor.scrollIntoView({ behavior: "smooth" });
		}
	}

	setScrollAnchor = (ref) => {
		this.scrollAnchor = ref;
	}


	setMessageToSend = ({target: {value}}) => {
		this.setState({messageToSend: value});
	}

	sendMessageHandle = () => {
		if (R.trim(this.state.messageToSend)) {
			this.setState({messageToSend: ""});
			this.props.sendMessage(this.state.messageToSend);
		}
	}

	render () {
		const chatRoom = this.props.chatRoom;
		const {messages} = chatRoom;
		return (
			<div className="chat-window">
			<Card className="chat">

				<CardHeader
					title={chatRoom.title}
					subtitle={`Room admin: ${chatRoom.admin}`}
					avatar={<Avatar>{R.pipe(R.head, R.toUpper)(chatRoom.title)}</Avatar>}
				/>

				<h3 className="label"><i>Active users in this room..</i></h3>

				<div className="room-users">
					{chatRoom.users && R.map((user: any) => {
						const directChat = () => this.props.directChat(user._id);
						return <Chip key={user.username} onClick={directChat}>
							<Avatar color="#444" icon={<SvgIconFace />} />
							{user.username}
						</Chip>;
						})(chatRoom.users)
					}
				</div>

				<hr/>

				<div className="messages" >
					{
						messages &&
						R.map(message => {
							const clazz = classname("chat-bubble", {mine: R.equals(this.props.userId, message.userId)});
							const directChat = () => this.props.directChat(message.userId);
							return <Chip key={message.time} style={{margin: 4}} className={clazz}>
								<Avatar color="#444" icon={<SvgIconFace />} />
								<div>
									<h5 onClick={directChat}>
										{message.username}
										<span title={message.time}>{moment(message.time).fromNow()}</span>
									</h5>

									<h4>{message.message}</h4>
								</div>
							</Chip>;
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
			</div>
		);
	}
}