import { combineEpics, ActionsObservable } from "redux-observable";
import { SUBMIT_LOGIN, LOGIN_SUCCESS, SUBMIT_SIGNUP, SIGNUP_SUCCESS } from "../actions/constants";
import { printLine } from "../utils/printline";
import { sendMessage } from "../websockets/websocket";
import { Observable } from "rxjs/Observable";
import {push} from 'react-router-redux';

const submitLoginEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SUBMIT_LOGIN)
    .do(({payload}) => {
        sendMessage({
            route: SUBMIT_LOGIN,
            message: payload
        })
    })
    .ignoreElements()



const submitSignUp = (actions$: ActionsObservable<any>, store) =>
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
    .switchMap(() => Observable.of(push('/home')))

const signupSuccessEpic = (actions$: ActionsObservable<any>, store) =>
    actions$.ofType(SIGNUP_SUCCESS)
    .switchMap(() => Observable.of(push('/home')))

export const authEpics = combineEpics(
    submitLoginEpic,
    submitSignUp,
    signupSuccessEpic,
    loginSuccessEpic
)