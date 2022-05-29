import { compose, createStore, combineReducers, applyMiddleware } from '@reduxjs/toolkit';
import { createInjectorsEnhancer } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';

function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    ...injectedReducers,
    // other non-injected reducers can go here...
  });
 
  return rootReducer
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ shouldHotReload: false }) : compose;

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(
  createReducer(),
  undefined,
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
    createInjectorsEnhancer({
      createReducer,
      runSaga: sagaMiddleware.run
    })
  )
)
