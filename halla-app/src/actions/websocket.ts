import { createAction } from 'redux-actions';
import * as Actions from './constants';

export const connect = createAction(Actions.CONNECT);
export const connectSuccessful = createAction(Actions.CONNECT_SUCCESSFUL);
export const connectionClosedOrFailed = createAction(Actions.CONNECTION_CLOSED_OR_FAILED);


export const connectedToRoomsNamespace = createAction(Actions.CONNECTED_TO_ROOMS_NAMESPACE);