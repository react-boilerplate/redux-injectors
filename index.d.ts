import { ComponentType } from "react";
import { Reducer, StoreEnhancer } from "redux";
import { Saga, Task } from "redux-saga";

/**
 * Forces a reload of the injected reducers. i.e. Causes `createReducer` to be
 * called again with the injected reducers. Useful for hot-reloading.
 *
 * @param store The redux store that has been configured with
 *                  `createInjectorsEnhancer`
 * @example
 * forceReducerReload(store);
 *
 * @public
 */
export function forceReducerReload(store: {}): void;

/**
 * Creates a store enhancer that when applied will setup the store to allow the
 * injectors to work properly
 *
 * @param {Object} options
 * @param {function} options.runSaga A function that runs a saga. Should usually be `sagaMiddleware.run`
 * @param {function} options.createReducer A function that should create and
 * return the root reducer. It's passed the injected reducers as the first
 * parameter. These should be added to the root reducer using `combineReducer`
 * or a similar method.
 *
 * @example
 *
 * import { createStore } from "redux"
 * import { createInjectorsEnhancer } from "injectors"
 *
 * function createReducer(injectedReducers = {}) {
 *  const rootReducer = combineReducers({
 *    ...injectedReducers,
 *    // other non-injected reducers can go here...
 *  });
 *
 *  return rootReducer
 * }
 * const runSaga = sagaMiddleware.run
 *
 * const store = createStore(
 *  createReducer(),
 *  undefined,
 *  createInjectorsEnhancer({
 *    createReducer,
 *    runSaga,
 *  })
 * )
 *
 * @public
 */
export function createInjectorsEnhancer(options: { 
  runSaga: <S extends Saga<any[]>>(saga: S, ...args: Parameters<S>) => Task,
  createReducer: (injectedReducers: { [key: string]: Reducer }) => Reducer
}): StoreEnhancer;

/**
 * An enum of all the possible saga injection behaviours
 *
 * @property {String} RESTART_ON_REMOUNT The saga will be started on component instantiation and cancelled with
 * `task.cancel()` on component unmount for improved performance.
 * @property {String} DAEMON Causes the saga to be started on component instantiation and never canceled
 * or started again.
 * @property {String} ONCE_TILL_UNMOUNT Behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 * @enum
 * @public
 */
export enum SagaInjectionModes {
  RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount",
  DAEMON = "@@saga-injector/daemon",
  ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount"
}

/**
 * A higher-order component that dynamically injects a saga when the component
 * is instantiated. There are several possible "modes" / "behaviours" that
 * dictate how and when the saga should be injected and ejected
 *
 * @param {Object} options
 * @param {string} options.key The key to inject the saga under
 * @param {function} options.saga The saga that will be injected
 * @param {string} [options.mode] The injection behaviour to use. The default is
 * `SagaInjectionModes.DAEMON` which causes the saga to be started on component
 * instantiation and never canceled or started again. @see
 * {@link SagaInjectionModes} for the other possible modes.
 *
 * @example
 *
 * class BooksManager extends React.PureComponent {
 *  render() {
 *    return null;
 *  }
 * }
 *
 * export default injectSaga({ key: "books", saga: booksSaga })(BooksManager)
 *
 * @public
 *
 */
export function injectSaga(options: { key: string, saga: Saga, mode?: SagaInjectionModes }): <T extends ComponentType>(Component: T) => T;

/**
 * A higher-order component that dynamically injects a reducer when the
 * component is instantiated
 *
 * @param {Object} options
 * @param {string} options.key The key to inject the reducer under
 * @param {function} options.reducer The reducer that will be injected
 *
 * @example
 *
 * class BooksManager extends React.PureComponent {
 *  render() {
 *    return null;
 *  }
 * }
 *
 * export default injectReducer({ key: "books", reducer: booksReducer })(BooksManager)
 *
 * @public
 */

export function injectReducer(options: { key: string, reducer: Reducer }): <T extends ComponentType>(Component: T) => T;
/**
 * A react hook that dynamically injects a saga when the hook is run
 *
 * @param {Object} options
 * @param {string} options.key The key to inject the saga under
 * @param {function} options.saga The saga that will be injected
 * @param {string} [options.mode] The injection behaviour to use. The default is
 * `SagaInjectionModes.DAEMON` which causes the saga to be started on component
 * instantiation and never canceled or started again. @see
 * {@link SagaInjectionModes} for the other possible modes.
 * 
 * @example
 *
 * function BooksManager() {
 *  useInjectSaga({ key: "books", saga: booksSaga })
 *
 *  return null;
 * }
 * 
 * @public
 */
export function useInjectSaga(options: { key: string, saga: Saga, mode?: SagaInjectionModes }): void;

/**
 * A react hook that dynamically injects a reducer when the hook is run
 *
 * @param {Object} options
 * @param {string} options.key The key to inject the reducer under
 * @param {function} options.reducer The reducer that will be injected
 * 
 * @example
 * 
 * function BooksManager() {
 *  useInjectReducer({ key: "books", reducer: booksReducer })
 *
 *  return null;
 * }
 * 
 * @public
 */
export function useInjectReducer(options: { key: string, reducer: Reducer }): void;
