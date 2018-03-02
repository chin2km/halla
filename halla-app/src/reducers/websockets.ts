import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';

const initialState: any = {};

export default handleActions({
  [Actions.CONNECT_SUCCESSFUL]: (state, action) => {
    return {
      ...action.payload
    };
  }
}, initialState);
