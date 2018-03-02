import { combineReducers, Reducer } from 'redux';
import user from './user';
import websocket from './websockets';

export interface RootState {
  user: UserStoreState;
}

export default combineReducers<RootState>({
  user,
  websocket
});
