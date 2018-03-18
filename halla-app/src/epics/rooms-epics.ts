import { combineEpics, ActionsObservable } from "redux-observable";
import { printLine } from "../utils/printline";
import { sendMessage, ROOMS_NSC } from "../websockets/websocket";
import { Observable } from "rxjs/Observable";
import { CREATE_ROOM, SET_ROOMS, FETCH_ROOMS } from "../actions/constants";

const createRoomEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(CREATE_ROOM)
    .do(({payload}) => {
        sendMessage({
            route: CREATE_ROOM,
            message: {
                title: payload,
                admin: store.getState().auth.user.username
            }
        }, ROOMS_NSC)
    })
    .ignoreElements()

export const fetchRoomsEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(FETCH_ROOMS)
        .do(() => sendMessage({route: FETCH_ROOMS}, ROOMS_NSC))
        .ignoreElements()


export const roomsEpics = combineEpics(
    createRoomEpic,
    fetchRoomsEpic
)