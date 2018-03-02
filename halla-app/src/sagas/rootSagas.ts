import { all, call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import * as ACTIONS from '../constants/actions';
import {authSagas} from './auth-sagas';
import { websocketSagas } from './websocket-sagas';

function* rootSagas() {
  while (true) {
    yield all([
      call(authSagas),
      call(websocketSagas)
    ])
  }
}

export function* appErrorLogger(error) {
  console.log(error)
}



export default rootSagas;