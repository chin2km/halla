import { all, call, put,take, takeEvery, takeLatest } from 'redux-saga/effects';
import {setLoginSuccess} from '../actions/auth'
import * as ACTIONS from '../constants/actions'
import {push} from 'react-router-redux';
import { delay } from 'redux-saga'
import { createRouteChannel } from '../websockets/pub-sub-util';
import { sendMessage } from './websocket-sagas';

export function* fetchUser(action) {
    try {
       const user = yield call(delay, 300);
       yield call(sendMessage, action.type, action.payload);
    } catch (e) {
       yield put({type: "FAIL", message: e.message});
    }
}

export function* subscribeLoginSuccess(route, ws) {
    const routeChannel = yield call(createRouteChannel, ws, route);
    while (true) {
        const routePayload = yield take(routeChannel);
        yield put(setLoginSuccess(routePayload));
        yield put(push('/home'));
    }
}

export function* authSagas() {
    yield all([
        takeEvery(ACTIONS.SUBMIT_LOGIN, fetchUser)
    ])
}