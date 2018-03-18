import { createAction } from 'redux-actions';
import * as Actions from './constants';

export const fetchRooms = createAction(Actions.FETCH_ROOMS);
export const setRooms = createAction<any>(Actions.SET_ROOMS);

export const createRoom = createAction<any>(Actions.CREATE_ROOM);
export const createRoomSuccess = createAction<any>(Actions.CREATE_ROOM_SUCCESSFUL);
export const createRoomFail = createAction<any>(Actions.CREATE_ROOM_FAIL);

