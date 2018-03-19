import * as R from 'ramda';
import SocketIO = require('socket.io-client');
import {store} from '../store/';
import * as ACTIONS from '../actions/constants';
import {ENDPOINT} from './constants';
import { connectSuccessful, connectedToRoomsNamespace } from '../actions/websocket';
import { LOGIN_SUCCESS } from '../actions/constants';
import { printLine } from '../utils/printline';

export const DEFAULT_NSC = "/";
export const ROOMS_NSC = "/rooms";

const ws = {};


export const connect = (namespace, nextAction) => {
    ws[namespace] = SocketIO(ENDPOINT + namespace, { transports: ['websocket'] });
    ws[namespace].on('connect',(res)=>{
        printLine("Connection to nsc ", namespace, " successfull")
        store.dispatch(nextAction());
    });
};

export const subscribe = (namespace, route, nextAction) => {
    ws[namespace].on(route, (message) => {
        printLine('Received message on:', route, ":", message )
        store.dispatch(nextAction(message));
    });
};

export const sendMessage = (config, namespace = DEFAULT_NSC) => {
    printLine('Sending message to:', config.route, ":", config.message )
    ws[namespace].emit(config.route, config.message);
};