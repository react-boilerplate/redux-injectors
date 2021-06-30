import React from 'react';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider, useSelector } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { fireEvent, render, screen } from '@testing-library/react';
import { format } from 'util';
import { put } from 'redux-saga/effects';
import { createInjectorsEnhancer, useInjectReducer } from '../index';
import { useInjectSaga } from '../injectSaga';
import { createManager } from '../createManager';

window.console.error = (...args) => {
  throw new Error(format(...args));
};

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
  it('should not log react warning "Cannot update a component from inside the function body of a different component" (see #19)', () => {
    const store = configureStore();

    function booksReducer() {
      return {
        books: [],
      };
    }

    function BooksInjectorComponent() {
      useInjectReducer({ key: 'books', reducer: booksReducer });

      return null;
    }

    // Intentionally using filter so this selector returns a new object ref
    const selectBooks = state => state?.books?.books?.filter(Boolean) || [];

    function BooksShowerComponent() {
      const books = useSelector(selectBooks);
      return <div>{JSON.stringify(books)}</div>;
    }

    function BooksInjectorWrapper() {
      const [show, setShow] = React.useState(false);
      return show ? (
        <BooksInjectorComponent />
      ) : (
        <button type="button" onClick={() => setShow(true)}>
          Inject books reducer
        </button>
      );
    }

    render(
      <Provider store={store}>
        <BooksInjectorWrapper />
        <BooksShowerComponent />
      </Provider>,
    );

    fireEvent.click(
      screen.queryByRole('button', { name: 'Inject books reducer' }),
    );
  });

  it('should return booleans indicating injection status', () => {
    const store = configureStore();

    function booksReducer() {
      return {
        books: [],
      };
    }

    function* booksSaga() {
      yield put({ type: 'TEST', payload: 'yup' });
    }

    function BooksInjectorComponent() {
      const reducerInjected = useInjectReducer({
        key: 'books',
        reducer: booksReducer,
      });
      const sagaInjected = useInjectSaga({ key: 'books', saga: booksSaga });

      return reducerInjected && sagaInjected ? (
        <div>Everything is injected</div>
      ) : (
        <div>Waiting for injection</div>
      );
    }

    const wrapper = render(
      <Provider store={store}>
        <BooksInjectorComponent />
      </Provider>,
    );

    expect(wrapper.container.textContent).toEqual('Everything is injected');
  });

  it('should create a manager that uses the COUNTER mode', () => {
    const store = configureStore();

    function booksReducer(state = { numSagaInjections: 0 }, action) {
      if (action.type === 'SAGA_INJECTION') {
        return {
          numSagaInjections: state.numSagaInjections + 1,
        };
      }

      return state;
    }

    function* booksSaga() {
      yield put({ type: 'SAGA_INJECTION' });
    }

    const BooksManager = createManager({
      name: 'BooksManager',
      key: 'books',
      reducer: booksReducer,
      saga: booksSaga,
    });

    function BooksList() {
      const numSagaInjections = useSelector(
        state => state.books.numSagaInjections,
      );

      return <div>Books List (Num Saga Injections: {numSagaInjections})</div>;
    }

    function BooksPage() {
      const numSagaInjections = useSelector(
        state => state.books.numSagaInjections,
      );

      return <div>Books Page (Num Saga Injections: {numSagaInjections})</div>;
    }

    function App() {
      const [showList, setShowList] = React.useState(true);
      const [showPage, setShowPage] = React.useState(true);

      return (
        <div>
          {showList && (
            <BooksManager>
              <BooksList />
            </BooksManager>
          )}
          <button type="button" onClick={() => setShowList(!showList)}>
            Toggle List
          </button>
          {showPage && (
            <BooksManager>
              <BooksPage />
            </BooksManager>
          )}
          <button type="button" onClick={() => setShowPage(!showPage)}>
            Toggle Page
          </button>
        </div>
      );
    }

    const wrapper = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    expect(wrapper.container.textContent).toContain(
      'Books List (Num Saga Injections: 1)',
    );
    expect(wrapper.container.textContent).toContain(
      'Books Page (Num Saga Injections: 1)',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Page' }));
    expect(wrapper.container.textContent).toContain(
      'Books List (Num Saga Injections: 1)',
    );
    expect(wrapper.container.textContent).not.toContain('Books Page');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Page' }));
    expect(wrapper.container.textContent).toContain(
      'Books List (Num Saga Injections: 1)',
    );
    expect(wrapper.container.textContent).toContain(
      'Books Page (Num Saga Injections: 1)',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Toggle Page' }));
    expect(wrapper.container.textContent).toContain(
      'Books List (Num Saga Injections: 1)',
    );
    expect(wrapper.container.textContent).not.toContain('Books Page');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle List' }));
    expect(wrapper.container.textContent).not.toContain('Books List');
    expect(wrapper.container.textContent).not.toContain('Books Page');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle List' }));
    fireEvent.click(screen.getByRole('button', { name: 'Toggle Page' }));

    expect(wrapper.container.textContent).toContain(
      'Books List (Num Saga Injections: 2)',
    );
    expect(wrapper.container.textContent).toContain(
      'Books Page (Num Saga Injections: 2)',
    );
  });
});
