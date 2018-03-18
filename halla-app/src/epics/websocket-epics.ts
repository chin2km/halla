import { ActionsObservable, combineEpics } from "redux-observable";
import { CONNECT, CONNECT_SUCCESSFUL, LOGIN_SUCCESS, SIGNUP_SUCCESS, SIGNUP_FAIL, LOGIN_FAIL, CONNECTED_TO_ROOMS_NAMESPACE, CREATE_ROOM_SUCCESSFUL, CREATE_ROOM_FAIL, FETCH_ROOMS, SET_ROOMS } from "../actions/constants";
import { connect, subscribe, DEFAULT_NSC, ROOMS_NSC, sendMessage } from "../websockets/websocket";
import SocketIO = require('socket.io-client');
import { Observable } from "rxjs/Observable";
import { connectSuccessful, connectionClosedOrFailed } from "../actions/websocket";
import { ENDPOINT } from "../websockets/constants";
import { printLine } from "../utils/printline";
import { url } from "inspector";
import { setLoginSuccess, setSignupSuccess, setSignupFail, setLoginFail } from "../actions/auth";
import { createRoomSuccess, createRoomFail, setRooms } from "../actions/RoomsList";



export const connectEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECT)
        .do(() => connect(DEFAULT_NSC, connectSuccessful))
        .ignoreElements()

export const connectionSuccessfulEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECT_SUCCESSFUL)
        .do(() => subscribe(DEFAULT_NSC, LOGIN_SUCCESS, setLoginSuccess))
        .do(() => subscribe(DEFAULT_NSC, LOGIN_FAIL, setLoginFail))
        .do(() => subscribe(DEFAULT_NSC, SIGNUP_SUCCESS, setSignupSuccess))
        .do(() => subscribe(DEFAULT_NSC, SIGNUP_FAIL, setSignupFail))
        .ignoreElements()

export const connectedToRoomsNscEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECTED_TO_ROOMS_NAMESPACE)
        .do(() => subscribe(ROOMS_NSC, SET_ROOMS, setRooms))
        .do(() => subscribe(ROOMS_NSC, CREATE_ROOM_SUCCESSFUL, createRoomSuccess))
        .do(() => subscribe(ROOMS_NSC, CREATE_ROOM_FAIL, createRoomFail))
        .ignoreElements()

export const websocketEpics = combineEpics(
    connectEpic,
    connectionSuccessfulEpic,
    connectedToRoomsNscEpic
);