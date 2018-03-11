import { createAction } from 'redux-actions';
import * as Actions from './constants';

export const connect = createAction(Actions.CONNECT);
export const connectSuccessful = createAction<any>(Actions.CONNECT_SUCCESSFUL);
export const connectionClosedOrFailed = createAction(Actions.CONNECTION_CLOSED_OR_FAILED);