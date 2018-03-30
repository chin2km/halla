import * as React from "react";
import * as R from "ramda";
import * as ChatRoomActions from "../../actions/Chatroom";
import { RouteComponentProps } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RootState } from "../../reducers";
import CommunicationChatBubble from "material-ui/svg-icons/communication/chat-bubble";

import "./style.less";
import { RoomChat, DirectChat } from "../../components";

export namespace RightPane {
	export interface Props extends RouteComponentProps<void> {
		chatRoom?: any;
		userId?: string;
		actions?: typeof ChatRoomActions;
	}

	export interface State {
	}
}

class RightPane extends React.Component<RightPane.Props, RightPane.State> {


	render () {
		const {chatRoom} = this.props;
	return <div className="pane2">
		{
			!R.isEmpty(chatRoom) ?
				R.both(R.has("sender"), R.has("recipient"))(chatRoom) ?
					<DirectChat
						userId={this.props.userId}
						chatRoom={chatRoom}
						sendMessage={this.props.actions.sendDirectMessage}
					/> :
					<RoomChat
						userId={this.props.userId}
						chatRoom={chatRoom}
						sendMessage={this.props.actions.sendMessageToRoom}
					/>
			: <CommunicationChatBubble className="chat-panel-icon" />

		}
	</div>;
	}
}

const mapStateToProps = (state: RootState) => {
	return {
		chatRoom: state.chatRoom,
		userId: state.auth.user._id
	};
};

function mapDispatchToProps (dispatch) {
	return {
		actions: bindActionCreators(ChatRoomActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(RightPane);