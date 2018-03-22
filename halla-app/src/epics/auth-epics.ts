import { combineEpics, ActionsObservable } from "redux-observable";
import { SUBMIT_LOGIN, LOGIN_SUCCESS, SUBMIT_SIGNUP, SIGNUP_SUCCESS, LOGIN_FAIL, SIGNUP_FAIL } from "../actions/constants";
import { printLine } from "../utils/printline";
import { sendMessage, connect, ROOMS_NSC, CHATROOM_NSC } from "../websockets/websocket";
import { Observable } from "rxjs/Observable";
import {push} from 'react-router-redux';
import { connectedToRoomsNsc, connectedToChatroomNsc } from "../actions/websocket";
import { addNotification } from "../actions/auth";

const submitLoginEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SUBMIT_LOGIN)
    .do(({payload}) => {
        sendMessage({
            route: SUBMIT_LOGIN,
            message: payload
        })
    })
    .ignoreElements()



const submitSignUpEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SUBMIT_SIGNUP)
    .do(({payload}) => {
        sendMessage({
            route: SUBMIT_SIGNUP,
            message: payload
        })
    })
    .ignoreElements()


const loginSuccessEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(LOGIN_SUCCESS)
    // .do(() => connect(ROOMS_NSC, connectedToRoomsNsc))
    // .do(() => connect(CHATROOM_NSC, connectedToChatroomNsc))
    .switchMap(() => Observable.concat(
        Observable.of(push('/home')),
        Observable.of(addNotification({type: 'success', message: 'Logged in successfully'}))
    ))

const loginFailEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(LOGIN_FAIL)
    .switchMap(() => Observable.concat(
        Observable.of(addNotification({type: 'error', title: 'Login failed!', message: "Combination of credentials not found!"}))
    ))

const signupSuccessEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SIGNUP_SUCCESS)
    .switchMap(() => Observable.concat(
        Observable.of(addNotification({type: 'success', title: "success!", message: 'Sigined up successfully!'}))
    ))

const signupFailEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SIGNUP_FAIL)
    .switchMap(() => Observable.concat(
        Observable.of(addNotification({type: 'error', title: 'Signup failed!', message: 'Username aready taken!'}))
    ))

export const authEpics = combineEpics(
    submitLoginEpic,
    loginSuccessEpic,
    loginFailEpic,
    submitSignUpEpic,
    signupSuccessEpic,
    signupFailEpic
)