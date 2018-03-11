import { handleActions } from 'redux-actions';
import * as Actions from '../actions/constants';

const initialState: UserStoreState = {};

export default handleActions<UserStoreState, LoginData>({
  [Actions.LOGIN_SUCCESS]: (state, action) => {
    return {
      ...action.payload
    };
  }
}, initialState);
