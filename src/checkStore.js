import { conformsTo, isFunction, isObject } from 'lodash';
import invariant from 'invariant';

/**
 * Validate the shape of redux store
 */
export default function checkStore(store) {
  const shape = {
    dispatch: isFunction,
    subscribe: isFunction,
    getState: isFunction,
    replaceReducer: isFunction,
    runSaga: isFunction,
    createReducer: isFunction,
    injectedReducers: isObject,
    injectedSagas: isObject,
  };
  invariant(
    conformsTo(store, shape),
    '(injectors...) checkStore: Expected a redux store that has been configured for use with injectors.',
  );
}
