import { combineReducers, Reducer } from 'redux';
import user from './user';
import ws from './websockets';

export interface RootState {
  user: UserStoreState;
  ws: any
}

export default combineReducers<RootState>({
  user,
  ws
});
