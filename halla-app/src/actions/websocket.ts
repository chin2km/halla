import { createAction } from 'redux-actions';
import * as Actions from '../constants/actions';

export const connect = createAction(Actions.CONNECT);
export const connectSuccessful = createAction<any>(Actions.CONNECT_SUCCESSFUL);