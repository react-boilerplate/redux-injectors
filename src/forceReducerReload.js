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
export function forceReducerReload(store) {
  store.replaceReducer(store.createReducer(store.injectedReducers));
}
