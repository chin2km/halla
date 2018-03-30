import { ActionsObservable, combineEpics } from "redux-observable";
import { SEND_MESSAGE_TO_ROOM, SEND_DIRECT_MESSAGE } from "../actions/constants";
import { CHATROOM_NSC, sendMessage } from "../websockets/websocket";

const sendMessageToRoomEpic = (action$: ActionsObservable<any>, store: any) =>
	action$.ofType(SEND_MESSAGE_TO_ROOM)
		.do(({payload}) => {
			sendMessage({
				route: SEND_MESSAGE_TO_ROOM,
				message: {
					message: {
						message: payload,
						userId: store.getState().auth.user._id,
						username: store.getState().auth.user.username
					},
					roomId: store.getState().chatRoom._id,
				}
			}, CHATROOM_NSC);
		})
		.ignoreElements();

const sendDirectMessageEpic = (action$: ActionsObservable<any>, store: any) =>
	action$.ofType(SEND_DIRECT_MESSAGE)
		.do(({payload}) => {
			sendMessage({
				route: SEND_DIRECT_MESSAGE,
				message: {
					message: payload,
					sender: store.getState().auth.user._id,
					recipient: store.getState().chatRoom.recipient
				}
			}, CHATROOM_NSC);
		})
		.ignoreElements();

export const chatRoomEpics = combineEpics(
	sendMessageToRoomEpic,
	sendDirectMessageEpic
);