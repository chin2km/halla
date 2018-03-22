import { handleActions } from 'redux-actions';
import * as Actions from '../actions/constants';

const initialState: UserStoreState = {
};

export default handleActions<UserStoreState, any>({
  [Actions.LOGIN_SUCCESS]: (state, action) => {
    return {
      user: action.payload
    };
  },
  [Actions.LOGIN_FAIL]: (state, action) => {
    return {
      error: action.payload
    };
  }
}, initialState);
