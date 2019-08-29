export function forceReducerReload(store) {
  store.replaceReducer(store.createReducer(store.injectedReducers));
}
