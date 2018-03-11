import { ActionsObservable, combineEpics } from "redux-observable";
import { CONNECT, CONNECT_SUCCESSFUL, LOGIN_SUCCESS } from "../actions/constants";
import { connect, subscribe } from "../websockets/websocket";
import SocketIO = require('socket.io-client');
import { Observable } from "rxjs/Observable";
import { connectSuccessful, connectionClosedOrFailed } from "../actions/websocket";
import { ENDPOINT } from "../websockets/constants";
import { printLine } from "../utils/printline";
import { url } from "inspector";
import { setLoginSuccess } from "../actions/auth";



export const connectEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECT)
        .do(connect())
        .ignoreElements()

export const connectionSuccessfulEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CONNECT_SUCCESSFUL)
        .do(subscribe(LOGIN_SUCCESS, setLoginSuccess))
        .ignoreElements()

export const websocketEpics = combineEpics(
    connectEpic,
    connectionSuccessfulEpic
);