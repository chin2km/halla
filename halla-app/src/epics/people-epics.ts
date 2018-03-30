import { combineEpics, ActionsObservable } from "redux-observable";
import { sendMessage, ROOMS_NSC, CHATROOM_NSC } from "../websockets/websocket";
import { FETCH_PEOPLE, DIRECT_CHAT, DIRECT_CHAT_SUCCESS } from "../actions/constants";
import { addNotification } from "../actions/auth";
import { Observable } from "rxjs/Observable";

export const fetchPeopleEpic = (action$: ActionsObservable<any>) =>
	action$.ofType(FETCH_PEOPLE)
		.do(() => sendMessage({route: FETCH_PEOPLE}, ROOMS_NSC))
		.ignoreElements();

export const directChatEpic = (action$: ActionsObservable<any>, store) =>
	action$.ofType(DIRECT_CHAT)
		.do(({payload}) => {
			sendMessage({
				route: DIRECT_CHAT,
				message: {
					recipient: payload,
					sender: store.getState().auth.user._id
				}
			}, CHATROOM_NSC);
		})
		.switchMap(() =>
			action$.ofType(DIRECT_CHAT_SUCCESS)
				.take(1)
				.switchMap(({payload}) => Observable.concat(
					Observable.of(addNotification({type: "success", title: "Connected to direct chat!"})),
				))
		);


export const peopleEpics = combineEpics(
	fetchPeopleEpic,
	directChatEpic
);