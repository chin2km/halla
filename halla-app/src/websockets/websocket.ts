import R from 'ramda';
import SocketIO = require('socket.io-client');
import {store} from '../store/';
import * as ACTIONS from '../actions/constants';
import {ENDPOINT} from './constants';
import { connectSuccessful } from '../actions/websocket';
import { LOGIN_SUCCESS } from '../actions/constants';
import { printLine } from '../utils/printline';

const ws = {
    endpoint: 'ws://localhost:5027',
    socket: undefined
};

export const connect = () => {
    ws.socket = SocketIO(ENDPOINT);
    ws.socket.on('connected',(res)=>{
        store.dispatch(connectSuccessful(ws.socket));
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
