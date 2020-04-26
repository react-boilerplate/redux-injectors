import React from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { render } from '@testing-library/react';
import { createInjectorsEnhancer, useInjectReducer } from '../index';

function createReducer(injectedReducers = {}) {
  return combineReducers({
    global: () => ({ data: [] }),
    ...injectedReducers,
  });
}

function configureStore() {
  const sagaMiddleware = createSagaMiddleware();

  const enhancers = [
    applyMiddleware(sagaMiddleware),
    createInjectorsEnhancer({
      runSaga: sagaMiddleware.run,
      createReducer,
    }),
  ];

  const store = createStore(createReducer(), {}, compose(...enhancers));

  return store;
}

describe('redux-injectors', () => {
  it('should not log react warning (regression test for #19)', () => {
    const store = configureStore();

    function usersReducer() {
      return {
        users: [],
      };
    }

    function booksReducer() {
      return {
        books: [],
      };
    }

    const ChildComponent = () => {
      useInjectReducer({ key: 'books', reducer: booksReducer });
      return null;
    };

    const ParentComponent = () => {
      useInjectReducer({ key: 'users', reducer: usersReducer });
      return (
        <>
          <ChildComponent />
        </>
      );
    };

    render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>,
    );
  });
});
