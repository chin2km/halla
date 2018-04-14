import * as R from "ramda";
import { ActionsObservable, combineEpics } from "redux-observable";
import { SEND_MESSAGE_TO_ROOM, SEND_DIRECT_MESSAGE, NEW_DIRECT_MESSAGE } from "../../halla-shared/src/Actions";
import { sendMessage } from "../websockets/websocket";
import { CHATROOM_NSC } from "../../halla-shared/src/Namespaces";
import { Observable } from "rxjs/Observable";
import { addNotification } from "../actions/auth";

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
					recipient: store.getState().chatRoom.recipient._id
				}
			}, CHATROOM_NSC);
		})
		.ignoreElements();

export const newUserJoinedEpic = (action$: ActionsObservable<any>, store) =>
		action$.ofType(NEW_DIRECT_MESSAGE)
			.switchMap(({payload: {username, sender}}) => {
				const {username: name} = R.find(R.propEq("_id", sender), store.getState().people);
				const loggedInUser = store.getState().auth.user._id;
				if (sender !== loggedInUser) {
					return Observable.of(addNotification({type: "info", title: "Yay!", message: `You have recieved a private message from ${name}`}));
				}
				return Observable.empty();
			});

export const chatRoomEpics = combineEpics(
	sendMessageToRoomEpic,
	sendDirectMessageEpic,
	newUserJoinedEpic
);