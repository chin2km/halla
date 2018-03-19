import { combineEpics, ActionsObservable } from "redux-observable";
import { printLine } from "../utils/printline";
import { sendMessage, ROOMS_NSC, CHATROOM_NSC } from "../websockets/websocket";
import { Observable } from "rxjs/Observable";
import { CREATE_ROOM, SET_ROOMS, FETCH_ROOMS, CREATE_ROOM_SUCCESSFUL, CREATE_ROOM_FAIL, JOIN_ROOM } from "../actions/constants";
import { addNotification } from "../actions/auth";
import { fetchRooms } from "../actions/RoomsList";

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

export const createRoomSuccessEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CREATE_ROOM_SUCCESSFUL)
        .switchMap(({payload: {title, admin}}) => Observable.concat(
            Observable.of(addNotification({type: 'success', title: "Room created!", message: `Room ${title} added by ${admin}!`})),
            Observable.of(fetchRooms())
        ))

export const createRoomFailedEpic = (action$: ActionsObservable<any>) =>
    action$.ofType(CREATE_ROOM_FAIL)
        .switchMap(() => Observable.concat(
            Observable.of(addNotification({type: 'error', title: "Error!", message: 'A room with the name exists!'})),
            Observable.of(fetchRooms())
        ))

export const joinRoomEpic = (action$: ActionsObservable<any>, store) =>
    action$.ofType(JOIN_ROOM)
        .do(({payload}) => {
            sendMessage({
                route: JOIN_ROOM,
                message: {
                    id: payload,
                    userId: store.getState().auth.user._id
                }
            }, CHATROOM_NSC)
        })
        .ignoreElements()


export const roomsEpics = combineEpics(
    createRoomEpic,
    fetchRoomsEpic,
    createRoomSuccessEpic,
    createRoomFailedEpic,
    joinRoomEpic
)