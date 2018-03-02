import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import { createBrowserHistory } from 'history';
import { logger, sagaMiddleware, createRouterMiddleware } from '../middleware';
import rootReducer, { RootState } from '../reducers';
import rootSagas from '../sagas/rootSagas'


function configureStore(history: any,initialState?: RootState) {
  let middleware = applyMiddleware(sagaMiddleware, logger, createRouterMiddleware(history));
  
  if (process.env.NODE_ENV === 'development') {
    middleware = composeWithDevTools(middleware);
  }
  
  const store = createStore(rootReducer, initialState, middleware) as Store<RootState>;
  
  
  sagaMiddleware.run(rootSagas)
  
  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }
  
  return store;
}

export const history = createBrowserHistory();
export const store = configureStore(history);
