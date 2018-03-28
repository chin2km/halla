import { createAction } from "redux-actions";
import * as Actions from "./constants";

export const addNotification = createAction<any>(Actions.ADD_NOTIFICATION);

export const logout = createAction(Actions.LOGOUT);

export const submitLogin = createAction<LoginData>(Actions.SUBMIT_LOGIN);
export const setLoginSuccess = createAction<LoginData>(Actions.LOGIN_SUCCESS);
export const setLoginFail = createAction<LoginData>(Actions.LOGIN_FAIL);

export const submitSignUp = createAction<any>(Actions.SUBMIT_SIGNUP);
export const setSignupSuccess = createAction<any>(Actions.SIGNUP_SUCCESS);
export const setSignupFail = createAction(Actions.SIGNUP_FAIL);

