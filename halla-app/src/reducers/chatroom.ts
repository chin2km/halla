import * as R from 'ramda';
import { handleActions } from 'redux-actions';
import * as Actions from '../actions/constants';

const initialState: any = {};

export default handleActions({
  [Actions.LOGIN_SUCCESS]: (state, action) => {
    return {};
  },
  [Actions.JOIN_ROOM_SUCCESS]: (state, action) => {
    return action.payload;
  },
  [Actions.SET_ROOM_USERS]: (state, action) => {
    if(state._id === action.payload.roomId) {
      state.users = action.payload.users
    }
    return {...state};
  },
  [Actions.REMOVE_USER]: (state, action) => {
    if(state._id === action.payload.roomId) {
      state.users = R.reject(R.propEq("_id", action.payload.userId))(state.users);
    }
    return {...state};
  }
}, initialState);
