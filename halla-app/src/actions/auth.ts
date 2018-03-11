import { createAction } from 'redux-actions';
import * as Actions from './constants';

export const logout = createAction(Actions.LOGOUT);
export const submitLogin = createAction<LoginData>(Actions.SUBMIT_LOGIN);
export const setLoginSuccess = createAction<LoginData>(Actions.LOGIN_SUCCESS);
export const submitSignUp = createAction<any>(Actions.SUBMIT_SIGNUP);

