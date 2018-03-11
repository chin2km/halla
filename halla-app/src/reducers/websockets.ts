import { handleActions } from 'redux-actions';
import * as Actions from '../actions/constants';

const initialState: any = {};

export default handleActions({
  [Actions.CONNECT_SUCCESSFUL]: (state, action) => {
    return {
      ...action.payload
    };
  }
}, initialState);
