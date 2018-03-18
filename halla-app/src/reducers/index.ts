import { combineReducers, Reducer } from 'redux';
import auth from './auth';
import loading from './loading';
import ws from './websockets';
import rooms from './rooms';

export interface RootState {
  auth: UserStoreState;
  ws: any,
  loading: boolean,
  rooms: any[]
}

export default combineReducers<RootState>({
  auth,
  ws,
  loading,
  rooms
});
