import { handleActions } from "redux-actions";
import * as Actions from "../../../halla-shared/src/Actions";

export const componentsStatesInitialState = {
	login: {
		error: "",
		loading: false
	},
	createRoom: {
		open: false,
		error: "",
		loading: false
	},
	leftPane: {
		loading: false
	}
};

export default handleActions<typeof componentsStatesInitialState, any>({
	[Actions.SUBMIT_LOGIN]: (state) => ({...state, login: {...state.login, loading: true}}),
	[Actions.SUBMIT_SIGNUP]: (state) => ({...state, login: {...state.login, loading: true}}),
	[Actions.LOGIN_SUCCESS]: (state) => ({...state, login: {...state.login, loading: false}}),
	[Actions.SIGNUP_SUCCESS]: (state) => ({...state, login: {...state.login, loading: false}}),
	[Actions.LOGIN_FAIL]: (state) => ({...state, login: {...state.login, loading: false}}),
	[Actions.SIGNUP_FAIL]: (state) => ({...state, login: {...state.login, loading: false}}),
	[Actions.OPEN_CREATE_ROOM]: (state) => ({...state, createRoom: {...state.createRoom, open: true, loading: false}}),
	[Actions.CLOSE_CREATE_ROOM]: (state) => ({...state, createRoom: {...state.createRoom, open: false, loading: false}}),
	[Actions.CREATE_ROOM]: (state) => ({...state, createRoom: {...state.createRoom, loading: true}}),
	[Actions.CREATE_ROOM_SUCCESSFUL]: (state) => ({...state, createRoom: {...state.createRoom, loading: false, open: false}}),
	[Actions.CREATE_ROOM_FAIL]: (state, action) => ({...state, createRoom: {...state.createRoom, error: action.payload, loading: false}}),
	[Actions.JOIN_ROOM]: (state) => ({...state, leftPane: {...state.leftPane, loading: true}}),
	[Actions.FETCH_ROOMS]: (state) => ({...state, leftPane: {...state.leftPane, loading: true}}),
	[Actions.JOIN_ROOM_SUCCESS]: (state) => ({...state, leftPane: {...state.leftPane, loading: false}}),
	[Actions.SET_ROOMS]: (state) => ({...state, leftPane: {...state.leftPane, loading: false}}),
	[Actions.DIRECT_CHAT]: (state) => ({...state, leftPane: {...state.leftPane, loading: true}}),
	[Actions.DIRECT_CHAT_SUCCESS]: (state) => ({...state, leftPane: {...state.leftPane, loading: false}}),
}, componentsStatesInitialState);
