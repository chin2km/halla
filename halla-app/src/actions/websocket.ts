import { createAction } from "redux-actions";
import * as Actions from "./constants";

export const connect = createAction(Actions.CONNECT);
export const connectSuccessful = createAction(Actions.CONNECT_SUCCESSFUL);

export const connectedToRoomsNsc = createAction(Actions.CONNECTED_TO_ROOMS_NSC);
export const connectedToChatroomNsc = createAction(Actions.CONNECTED_TO_CHATROOM_NSC);