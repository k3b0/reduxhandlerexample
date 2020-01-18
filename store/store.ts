import { createStore, applyMiddleware, compose } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { appStateReducer } from './reducers';
import { AppStateActionTypes } from './actionTypes';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(appStateReducer, composeEnhancers(applyMiddleware(thunk as ThunkMiddleware<ReturnType<typeof appStateReducer>, AppStateActionTypes>)))

export default store;