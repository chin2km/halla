import { createAction } from "redux-actions";
import * as Actions from "../../halla-shared/src/Actions";

export const fetchRooms = createAction(Actions.FETCH_ROOMS);
export const setRooms = createAction<any>(Actions.SET_ROOMS);

export const openCreateRoom = createAction(Actions.OPEN_CREATE_ROOM);
export const closeCreateRoom = createAction(Actions.CLOSE_CREATE_ROOM);
export const createRoom = createAction<any>(Actions.CREATE_ROOM);
export const createRoomSuccess = createAction<any>(Actions.CREATE_ROOM_SUCCESSFUL);
export const createRoomFail = createAction<any>(Actions.CREATE_ROOM_FAIL);


