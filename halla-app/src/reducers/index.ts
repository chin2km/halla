import { combineReducers, Reducer } from 'redux';
import auth from './auth';
import componentsStates, { componentsStatesInitialState } from './components-states';
import ws from './websockets';
import rooms from './rooms';
import {reducer as toastrReducer} from 'react-redux-toastr'

export interface RootState {
  auth: UserStoreState;
  ws: any,
  componentsStates: typeof componentsStatesInitialState,
  rooms: any[],
  toastr: any
}

export default combineReducers<RootState>({
  auth,
  ws,
  componentsStates,
  rooms,
  toastr: toastrReducer
});
