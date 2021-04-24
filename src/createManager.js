import { useInjectReducer } from './injectReducer';
import { useInjectSaga } from './injectSaga';

/**
 * Creates a "manager" component that will inject the provided reducer and saga
 * when mounted.  It only renders its children after both the reducer and saga
 * have been injected.  This is the recommended way to use redux-injectors.
 *
 * @param {Object} options
 * @param {function} options.name The name to give the manager that shows up in the react devtools
 * @param {string} options.key The key to inject the reducer under
 * @param {function} options.reducer The reducer that will be injected
 * @param {function} options.saga The saga that will be injected
 *
 * @example
 *
 * const BooksManager = createManager({ name: "BooksManager", key: "books", reducer: booksReducer, saga: booksSaga })
 *
 * @returns {ComponentType<{ children: ReactNode }>} The manager
 * @public
 */
export function createManager({ name, key, reducer, saga }) {
  function Manager(props) {
    /* eslint-disable react-hooks/rules-of-hooks */

    const isReducerInjected = reducer
      ? useInjectReducer({ key, reducer })
      : true;

    const isSagaInjected = saga ? useInjectSaga({ key, saga }) : true;

    /* eslint-enable */

    return isReducerInjected && isSagaInjected ? props.children : null;
  }

  Manager.displayName = name;

  return Manager;
}
