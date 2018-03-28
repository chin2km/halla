import { createLogger } from "redux-logger";

const logger = createLogger({collapsed: true, diff: false, duration: true});

export default logger;

