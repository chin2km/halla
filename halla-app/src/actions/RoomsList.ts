import { createAction } from 'redux-actions';
import * as Actions from './constants';

export const createRoom = createAction<any>(Actions.CREATE_ROOM);
export const createRoomSuccess = createAction<any>(Actions.CREATE_ROOM_SUCCESSFUL);
export const createRoomFail = createAction<any>(Actions.CREATE_ROOM_FAIL);

