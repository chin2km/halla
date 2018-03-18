import { combineEpics, ActionsObservable } from "redux-observable";
import { printLine } from "../utils/printline";
import { sendMessage, ROOMS_NSC } from "../websockets/websocket";
import { Observable } from "rxjs/Observable";
import { CREATE_ROOM } from "../actions/constants";

const createRoomEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(CREATE_ROOM)
    .do(({payload}) => {
        sendMessage({
            route: CREATE_ROOM,
            message: payload
        }, ROOMS_NSC)
    })
    .ignoreElements()

export const roomsEpics = combineEpics(
    createRoomEpic
)