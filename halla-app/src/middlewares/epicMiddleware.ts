import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "../epics/rootEpic";

export default createEpicMiddleware(rootEpic);

