import invariant from 'invariant';
import conformsTo from 'lodash/conformsTo';
import isFunction from 'lodash/isFunction';

/**
 * Creates a store enhancer that when applied will setup the store to allow the
 * injectors to work properly
 *
 * @param {Object} params
 * @param {function} params.runSaga A function that runs a saga. Should usually be `sagaMiddleware.run`
 * @param {function} params.createReducer A function that should create and
 * return the root reducer. It's passed the injected reducers as the first
 * parameter. These should be added to the root reducer using `combineReducer`
 * or a similar method.
 *
 * @example
 *
 * import { createStore } from "redux"
 * import { createInjectorsEnhancer } from "redux-injectors"
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
 *   createReducer(),
 *   initialState,
 *   createInjectorsEnhancer({
 *     createReducer,
 *     runSaga,
 *   })
 * )
 *
 * @public
 */
export function createInjectorsEnhancer(params) {
  invariant(
    conformsTo(params, {
      runSaga: isFunction,
      createReducer: isFunction,
    }),
    '(redux-injectors...) createInjectorsEnhancer: params `runSaga` and ' +
      '`createReducer` are required.',
  );

  return createStore => (...args) => {
    const store = createStore(...args);

    return {
      ...store,
      createReducer: params.createReducer,
      runSaga: params.runSaga,
      injectedReducers: {}, // Reducer registry
      injectedSagas: {}, // Saga registry
    };
  };
}
