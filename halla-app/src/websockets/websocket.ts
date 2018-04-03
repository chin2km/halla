import * as SocketIO from "socket.io-client";
import * as R from "ramda";
import { store } from "../store/";
import { ENDPOINT } from "./constants";
import { printLine } from "../utils/printline";
import { DEFAULT_NSC } from "../../../halla-shared/src/Namespaces";

const ws = {};


export const connect = (namespace, nextAction) => {
	const userId = R.path(["auth", "user", "_id"], store.getState());

	ws[namespace] = SocketIO(ENDPOINT + namespace, {
		query: `userId=${userId}`,
		transports: ["websocket"],
		multiplex: !R.equals(DEFAULT_NSC, namespace),
	});
	ws[namespace].on("connect", () => {
		printLine("Connection to nsc ", namespace, " successfull");
		store.dispatch(nextAction());
	});
};

export const subscribe = (namespace, route, nextAction) => {
	ws[namespace].on(route, (message) => {
		printLine("Received message on:", route, ":", message );
		store.dispatch(nextAction(message));
	});
};

export const sendMessage = (config, namespace = DEFAULT_NSC) => {
	printLine("Sending message to:", config.route, ":", config.message );
	ws[namespace].emit(config.route, config.message);
};