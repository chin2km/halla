import * as R from 'ramda';
import SocketIO = require('socket.io-client');
import {store} from '../store/';
import * as ACTIONS from '../actions/constants';
import {ENDPOINT} from './constants';
import { connectSuccessful, connectedToRoomsNamespace } from '../actions/websocket';
import { LOGIN_SUCCESS } from '../actions/constants';
import { printLine } from '../utils/printline';

const ws = {
    endpoint: 'ws://localhost:5027',
    socket: undefined,
    roomsSocket: undefined
};

export const connect = () => {
    ws.socket = SocketIO(ENDPOINT + '/', { transports: ['websocket'] });
    ws.socket.on('connected',(res)=>{
        store.dispatch(connectSuccessful());
    });
    return ws.socket;
};

export const subscribe = (route, nextAction) => {
    ws.socket.on(route, (message) => {
        store.dispatch(nextAction(message));
    });
    return null;
};

export const sendMessage = (config) => {
    printLine('Sending message to:', config.route, ":", config.message )
    ws.socket.emit(config.route, config.message);
    return null;
};

export const connectRoomsNamespace = () => {
    ws.roomsSocket = SocketIO(ENDPOINT + '/rooms', { transports: ['websocket'] });
    ws.roomsSocket.on('connect', function () {
        store.dispatch(connectedToRoomsNamespace());
    });
    return null;
};

export const subscribeToRoomsNamespace = (route, nextAction) => {
    ws.roomsSocket.on(route, (message) => {
        store.dispatch(nextAction(message));
    });
    return null;
};

export const sendMessageToRoomsNamespace = (config) => {
    printLine('Sending message to Rooms Namespace:', config.route, ":", config.message )
    ws.roomsSocket.emit(config.route, config.message);
    return null;
};