import { handleActions } from "redux-actions";
import * as Actions from "../actions/constants";

const initialState: any = [];

export default handleActions({
	[Actions.SET_PEOPLE]: (state, action) => {
		return action.payload;
	},
	[Actions.NEW_USER]: (state, action) => {
		return [...state, action.payload];
	}
}, initialState);
