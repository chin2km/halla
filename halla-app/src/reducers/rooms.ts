import { handleActions } from "redux-actions";
import * as Actions from "../../../halla-shared/src/Actions";

const initialState: any = [];

export default handleActions({
	[Actions.SET_ROOMS]: (state, action) => {
		return action.payload;
	}
}, initialState);
