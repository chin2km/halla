import {combineEpics, ActionsObservable} from 'redux-observable';
import { websocketEpics } from './websocket-epics';
import { authEpics } from './auth-epics';
import { roomsEpics } from './rooms-epics';

export const rootEpic = combineEpics(
    websocketEpics,
    authEpics,
    roomsEpics
);