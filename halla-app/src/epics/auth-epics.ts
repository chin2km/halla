import { combineEpics, ActionsObservable } from "redux-observable";
import { SUBMIT_LOGIN, LOGIN_SUCCESS, SUBMIT_SIGNUP, SIGNUP_SUCCESS, LOGIN_FAIL, SIGNUP_FAIL } from "../actions/constants";
import { printLine } from "../utils/printline";
import { sendMessage, connect, ROOMS_NSC, CHATROOM_NSC } from "../websockets/websocket";
import { Observable } from "rxjs/Observable";
import {push} from 'react-router-redux';
import { connectedToRoomsNsc, connectedToChatroomNsc } from "../actions/websocket";
import { addNotification } from "../actions/auth";

const loginEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SUBMIT_LOGIN)
    .do(({payload}) => {
        sendMessage({
            route: SUBMIT_LOGIN,
            message: payload
        })
    })
    .switchMap(() =>
        Observable.race(
            actions$.ofType(LOGIN_SUCCESS)
                .take(1)
                // .do(() => connect(ROOMS_NSC, connectedToRoomsNsc))
                // .do(() => connect(CHATROOM_NSC, connectedToChatroomNsc))
                .switchMap(() => Observable.concat(
                    Observable.of(push('/home')),
                    Observable.of(addNotification({type: 'success', title: 'yay!', message: 'Logged in successfully'}))
                )),
            actions$.ofType(LOGIN_FAIL)
                .take(1)
                .map(() =>addNotification({type: 'error', title: 'Login failed!', message: "Combination of credentials not found!"}))
        )
    )


const signUpEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SUBMIT_SIGNUP)
        .do(({payload}) => {
            sendMessage({
                route: SUBMIT_SIGNUP,
                message: payload
            })
        })
        .switchMap(() =>
            Observable.race(
                actions$.ofType(SIGNUP_SUCCESS)
                    .take(1)
                    .map(() => addNotification({type: 'success', title: "yay!", message: 'Sigined up successfully! Go on and login..'})),
                actions$.ofType(SIGNUP_FAIL)
                    .take(1)
                    .map(() => addNotification({type: 'error', title: 'Signup failed!', message: 'Username aready taken!'}))
            )
        )

export const authEpics = combineEpics(
    loginEpic,
    signUpEpic
)