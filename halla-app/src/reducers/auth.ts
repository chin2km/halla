import { handleActions } from "redux-actions";
import * as Actions from "../../halla-shared/src/Actions";
import * as jwtDecode from "jwt-decode";

const initialState: UserStoreState = {
};

export default handleActions<UserStoreState, any>({
[Actions.LOGIN_SUCCESS]: (state, action) => {
	return {
		user: jwtDecode(action.payload),
		token: action.payload
	};
},
[Actions.LOGIN_FAIL]: (state, action) => {
	return {
	error: action.payload
	};
}
}, initialState);
