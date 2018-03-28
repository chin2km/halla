import { handleActions } from "redux-actions";
import * as Actions from "../actions/constants";

const initialState: any = [];

export default handleActions({
  [Actions.SET_ROOMS]: (state, action) => {
    return action.payload;
  }
}, initialState);
