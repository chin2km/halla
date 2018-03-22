import { handleActions } from 'redux-actions';
import * as Actions from '../actions/constants';

const initialState: any = {};

export default handleActions({
  [Actions.JOIN_ROOM_SUCCESS]: (state, action) => {
    return action.payload;
  },
  [Actions.SET_ROOM_USERS]: (state, action) => {
    return {...state, users: action.payload};
  }
}, initialState);
