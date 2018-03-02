import { connect, subscribe , sendMessage} from '../websockets/websocket';
import {eventChannel, END} from 'redux-saga';

export function createConnectionChannel(ws) {
    return eventChannel((emitter) => {
        const onConnectHandler = (event) => {
            emitter(event);
        };
        connect(ws, onConnectHandler);
        return () => emitter(END);
    });
}

export function createRouteChannel(ws, route) {
    return eventChannel((emitter) => {
        const onMessageHandler = (event) => {
            emitter(event);
        };

        subscribe(ws, route, onMessageHandler);
        return () => emitter(END);
    });
}

export function sendMessageToRoute(ws, config) {
    return eventChannel((emitter) => {
        const onSend = (event) => {
            emitter(true);
        };

        sendMessage(ws, config, onSend);
        return () => emitter(END);
    });
}

