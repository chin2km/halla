import { handleActions } from 'redux-actions';
import * as Actions from '../actions/constants';

const initialState = false;

export default handleActions<boolean, any>({
  [Actions.SUBMIT_LOGIN]: () => true,
  [Actions.SUBMIT_SIGNUP]: () => true,
  [Actions.LOGIN_SUCCESS]: () => false,
  [Actions.SIGNUP_SUCCESS]: () => false,
  [Actions.LOGIN_FAIL]: () => false,
  [Actions.SIGNUP_FAIL]: () => false
}, initialState);
