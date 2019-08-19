/**
 * @description Sets up the store to allow injectReducer and injectSaga to work. Mutates the store to allow this.
 * 
 * @param store The redux store to setup to use injectors
 * @param options.runSaga A function that runs a saga. Should ussually be `sagaMiddleware.run`
 * @param options.createReducer A function that should create and return the root reducer. Is passed the injected reducers as the first parameter. These should be added to the root reducer using `combineReducer` or a similar method.
 */
export function setupStoreForInjectors(store, options) {
  store.createReducer = options.createReducer;
  store.runSaga = options.runSaga;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas = {}; // Saga registry
}
