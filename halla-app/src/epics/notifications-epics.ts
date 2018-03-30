import { combineEpics, ActionsObservable } from "redux-observable";
import { ADD_NOTIFICATION } from "../actions/constants";
import { toastr } from "react-redux-toastr";

const addNotificationEpic = (actions$: ActionsObservable<any>, store) =>
	actions$.ofType(ADD_NOTIFICATION)
	.do(({payload: {type, message= "", title= ""}}) => {
		toastr[type](title, message);
	})
	.ignoreElements();

export const notificationEpics = combineEpics(
	addNotificationEpic
);