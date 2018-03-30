import { createAction } from "redux-actions";
import * as Actions from "./constants";

export const fetchPeople = createAction(Actions.FETCH_PEOPLE);
export const setPeople = createAction<any>(Actions.SET_PEOPLE);

export const directChat = createAction<any>(Actions.DIRECT_CHAT);
export const directChatSuccess = createAction<any>(Actions.DIRECT_CHAT_SUCCESS);