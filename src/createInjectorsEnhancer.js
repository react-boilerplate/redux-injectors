import invariant from 'invariant';
import conformsTo from 'lodash/conformsTo';
import isFunction from 'lodash/isFunction';

/**
 * @description Creates a store enhancer that when applied will setup the injectors to work
 *
 * @param options.runSaga A function that runs a saga. Should ussually be `sagaMiddleware.run`
 * @param options.createReducer A function that should create and return the root reducer. It's passed the injected reducers as the first parameter. These should be added to the root reducer using `combineReducer` or a similar method.
 */
export function createInjectorsEnhancer(options) {
  invariant(
    conformsTo(options, {
      runSaga: isFunction,
      createReducer: isFunction,
    }),
    '(injectors...) setupStoreForInjectors: options `runSaga` and ' +
      '`createReducer` are required.',
  );

  return createStore => (...args) => {
    const store = createStore(...args);

    return {
      ...store,
      createReducer: options.createReducer,
      runSaga: options.runSaga,
      injectedReducers: {}, // Reducer registry
      injectedSagas: {}, // Saga registry
    };
  };
}
