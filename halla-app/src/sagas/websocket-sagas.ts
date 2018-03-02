import { all, call, put, take, takeEvery, takeLatest } from 'redux-saga/effects';
import {appErrorLogger} from './rootSagas';
import * as ACTIONS from '../constants/actions'
import { createConnectionChannel, createRouteChannel, sendMessageToRoute } from '../websockets/pub-sub-util';
import { subscribeLoginSuccess } from './auth-sagas';

const ws = {
    endpoint: 'ws://localhost:5027'
};

export function* sendMessage(route, message) {
    try {
        yield call(sendMessageToRoute, ws, {
            route,
            message
        });
    } catch (e) {
       yield call(appErrorLogger, e);
    }
}

export function* doSubscriptions() {
    try {
        yield call(subscribeLoginSuccess, ACTIONS.LOGIN_SUCCESS, ws);

    } catch (e) {
       yield call(appErrorLogger, e);
    }
}


export function* connectSaga(action) {
    try {
        const channel = yield call(createConnectionChannel, ws);
        yield take(channel);
        yield call(doSubscriptions);
    } catch (e) {
       yield call(appErrorLogger, e);
    }
}

export function* websocketSagas() {
    yield all([
        takeEvery(ACTIONS.CONNECT, connectSaga)
    ]);
}