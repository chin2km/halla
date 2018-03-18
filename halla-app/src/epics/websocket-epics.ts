import { ActionsObservable, combineEpics } from "redux-observable";
import { CONNECT, CONNECT_SUCCESSFUL, LOGIN_SUCCESS, SIGNUP_SUCCESS, SIGNUP_FAIL, LOGIN_FAIL, CONNECTED_TO_ROOMS_NAMESPACE, CREATE_ROOM_SUCCESSFUL, CREATE_ROOM_FAIL } from "../actions/constants";
import { connect, subscribe, subscribeToRoomsNamespace } from "../websockets/websocket";
import SocketIO = require('socket.io-client');
import { Observable } from "rxjs/Observable";
import { connectSuccessful, connectionClosedOrFailed } from "../actions/websocket";
import { ENDPOINT } from "../websockets/constants";
import { printLine } from "../utils/printline";
import { url } from "inspector";
import { setLoginSuccess, setSignupSuccess, setSignupFail, setLoginFail } from "../actions/auth";
import { createRoomSuccess, createRoomFail } from "../actions/RoomsList";



export const connectEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECT)
        .do(connect())
        .ignoreElements()

export const connectionSuccessfulEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECT_SUCCESSFUL)
        .do(() => subscribe(LOGIN_SUCCESS, setLoginSuccess))
        .do(() => subscribe(LOGIN_FAIL, setLoginFail))
        .do(() => subscribe(SIGNUP_SUCCESS, setSignupSuccess))
        .do(() => subscribe(SIGNUP_FAIL, setSignupFail))
        .ignoreElements()

export const connectedToRoomsNscEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECTED_TO_ROOMS_NAMESPACE)
        .do(() => subscribeToRoomsNamespace(CREATE_ROOM_SUCCESSFUL, createRoomSuccess))
        .do(() => subscribeToRoomsNamespace(CREATE_ROOM_FAIL, createRoomFail))
        .ignoreElements()

export const websocketEpics = combineEpics(
    connectEpic,
    connectionSuccessfulEpic,
    connectedToRoomsNscEpic
);