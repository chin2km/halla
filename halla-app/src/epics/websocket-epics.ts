import { ActionsObservable, combineEpics } from "redux-observable";
import {
	CONNECT, CONNECT_SUCCESSFUL,
	LOGIN_SUCCESS, SIGNUP_SUCCESS,
	SIGNUP_FAIL, LOGIN_FAIL,
	CONNECTED_TO_ROOMS_NSC, CREATE_ROOM_SUCCESSFUL, CREATE_ROOM_FAIL,
	SET_ROOMS, CONNECTED_TO_CHATROOM_NSC, JOIN_ROOM_SUCCESS, SET_ROOM_USERS,
	REMOVE_USER, NEW_MESSAGE, SET_PEOPLE, NEW_DIRECT_MESSAGE, NEW_USER, DIRECT_CHAT_SUCCESS
} from "../../halla-shared/src/Actions";
import { connect, subscribe } from "../websockets/websocket";
import { connectSuccessful } from "../actions/websocket";
import { setLoginSuccess, setSignupSuccess, setSignupFail, setLoginFail } from "../actions/auth";
import { createRoomSuccess, createRoomFail, setRooms } from "../actions/RoomsList";
import { joinRoomSuccess, setRoomUsers, removeUser, newMessageReceived, newDirectMessageRecieved, newUserJoined } from "../actions/Chatroom";
import { setPeople, directChatSuccess } from "../actions/peopeList";
import { DEFAULT_NSC, ROOMS_NSC, CHATROOM_NSC } from "../../halla-shared/src/Namespaces";

export const connectEpic = (action$: ActionsObservable<any>) =>
	action$.ofType(CONNECT)
		.do(() => connect(DEFAULT_NSC, connectSuccessful))
		.ignoreElements();

export const connectionSuccessfulEpic = (action$: ActionsObservable<any>) =>
	action$.ofType(CONNECT_SUCCESSFUL)
		.do(() => subscribe(DEFAULT_NSC, LOGIN_SUCCESS, setLoginSuccess))
		.do(() => subscribe(DEFAULT_NSC, LOGIN_FAIL, setLoginFail))
		.do(() => subscribe(DEFAULT_NSC, SIGNUP_SUCCESS, setSignupSuccess))
		.do(() => subscribe(DEFAULT_NSC, SIGNUP_FAIL, setSignupFail))
		.ignoreElements();

export const connectedToRoomsNscEpic = (action$: ActionsObservable<any>) =>
	action$.ofType(CONNECTED_TO_ROOMS_NSC)
		.do(() => subscribe(ROOMS_NSC, SET_ROOMS, setRooms))
		.do(() => subscribe(ROOMS_NSC, SET_PEOPLE, setPeople))
		.do(() => subscribe(ROOMS_NSC, CREATE_ROOM_SUCCESSFUL, createRoomSuccess))
		.do(() => subscribe(ROOMS_NSC, CREATE_ROOM_FAIL, createRoomFail))
		.ignoreElements();

export const connectedToChatroomNscEpic = (action$: ActionsObservable<any>) =>
	action$.ofType(CONNECTED_TO_CHATROOM_NSC)
		.do(() => subscribe(CHATROOM_NSC, NEW_USER, newUserJoined))
		.do(() => subscribe(CHATROOM_NSC, JOIN_ROOM_SUCCESS, joinRoomSuccess))
		.do(() => subscribe(CHATROOM_NSC, DIRECT_CHAT_SUCCESS, directChatSuccess))
		.do(() => subscribe(CHATROOM_NSC, SET_ROOM_USERS, setRoomUsers))
		.do(() => subscribe(CHATROOM_NSC, REMOVE_USER, removeUser))
		.do(() => subscribe(CHATROOM_NSC, NEW_MESSAGE, newMessageReceived))
		.do(() => subscribe(CHATROOM_NSC, NEW_DIRECT_MESSAGE, newDirectMessageRecieved))
		.ignoreElements();

export const websocketEpics = combineEpics(
	connectEpic,
	connectionSuccessfulEpic,
	connectedToRoomsNscEpic,
	connectedToChatroomNscEpic
);