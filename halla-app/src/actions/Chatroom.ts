import { createAction } from "redux-actions";
import * as Actions from "./constants";

export const joinRoom = createAction<any>(Actions.JOIN_ROOM);
export const joinRoomSuccess = createAction<any>(Actions.JOIN_ROOM_SUCCESS);
export const setRoomUsers = createAction<any>(Actions.SET_ROOM_USERS);
export const removeUser = createAction<any>(Actions.REMOVE_USER);

export const sendMessageToRoom = createAction<any>(Actions.SEND_MESSAGE_TO_ROOM);
export const newMessageReceived = createAction<any>(Actions.NEW_MESSAGE);

export const sendDirectMessage = createAction<any>(Actions.SEND_DIRECT_MESSAGE);
export const newDirectMessageRecieved = createAction<any>(Actions.NEW_DIRECT_MESSAGE);

export const newUserJoined = createAction<any>(Actions.NEW_USER);
