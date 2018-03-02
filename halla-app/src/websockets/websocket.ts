import R from 'ramda';
import SocketIO = require('socket.io-client');
import {store} from '../store/';
import * as ACTIONS from '../constants/actions';
import {ENDPOINT} from './constants';
import { connectSuccessful } from '../actions/websocket';

export const connect = (ws, callback): void => {
    const socket = SocketIO(ENDPOINT);
    socket.on('connected',(res)=>{
        ws.socket = socket;
        callback(res);
        store.dispatch(connectSuccessful(ws));
    });
};

export const subscribe = (ws, route, onHandler) => {
    ws.socket.on(route, onHandler);
};

export const sendMessage = (ws, config, onSend) => {
    ws.socket.emit(config.route, config.message);
    onSend()
};
