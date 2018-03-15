import { combineReducers, Reducer } from 'redux';
import auth from './auth';
import loading from './loading';
import ws from './websockets';

export interface RootState {
  auth: UserStoreState;
  ws: any,
  loading: boolean
}

export default combineReducers<RootState>({
  auth,
  ws,
  loading
});
