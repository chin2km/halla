import { createAction } from 'redux-actions';
import * as Actions from './constants';

export const joinRoom = createAction<any>(Actions.JOIN_ROOM);
export const joinRoomSuccess = createAction<any>(Actions.JOIN_ROOM_SUCCESS);
export const setRoomUsers = createAction<any>(Actions.SET_ROOM_USERS);