import invariant from 'invariant';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import conformsTo from 'lodash/conformsTo';

import checkStore from './checkStore';
import {
  DAEMON,
  ONCE_TILL_UNMOUNT,
  RESTART_ON_REMOUNT,
  COUNTER,
} from './constants';

const allowedModes = [RESTART_ON_REMOUNT, DAEMON, ONCE_TILL_UNMOUNT, COUNTER];

const checkKey = key =>
  invariant(
    isString(key) && !isEmpty(key),
    '(redux-injectors...) injectSaga: Expected `key` to be a non empty string',
  );

const checkDescriptor = descriptor => {
  const shape = {
    saga: isFunction,
    mode: mode => isString(mode) && allowedModes.includes(mode),
    count: isNumber,
  };
  invariant(
    conformsTo(descriptor, shape),
    '(redux-injectors...) injectSaga: Expected a valid saga descriptor',
  );
};

export function injectSagaFactory(store, isValid) {
  return function injectSaga(key, descriptor = {}) {
    if (!isValid) checkStore(store);

    const newDescriptor = {
      ...descriptor,
      mode: descriptor.mode || DAEMON,
      count: 0,
    };
    const { saga, mode } = newDescriptor;

    checkKey(key);
    checkDescriptor(newDescriptor);

    let hasSaga = Reflect.has(store.injectedSagas, key);

    if (process.env.NODE_ENV !== 'production') {
      const oldDescriptor = store.injectedSagas[key];
      // enable hot reloading of daemon and once-till-unmount sagas
      if (hasSaga && oldDescriptor.saga !== saga) {
        oldDescriptor.task.cancel();
        hasSaga = false;
      }
    }

    if (mode === COUNTER) {
      // COUNTER must be added if saga is done
      if (store.injectedSagas[key] === 'done') hasSaga = false;
      let oldCounterValue = 0;
      if (hasSaga) {
        oldCounterValue = Math.max(store.injectedSagas[key].count || 0, 0);
      }
      newDescriptor.count = oldCounterValue + 1;
    }

    if (
      !hasSaga ||
      (hasSaga &&
        mode !== DAEMON &&
        mode !== ONCE_TILL_UNMOUNT &&
        mode !== COUNTER)
    ) {
      /* eslint-disable no-param-reassign */
      store.injectedSagas[key] = {
        ...newDescriptor,
        task: store.runSaga(saga),
      };
      /* eslint-enable no-param-reassign */
    } else if (hasSaga && mode === COUNTER) {
      // increment num of sagas that wants to be injected
      /* eslint-disable no-param-reassign */
      store.injectedSagas[key].count = newDescriptor.count;
    }
  };
}

export function ejectSagaFactory(store, isValid) {
  return function ejectSaga(key) {
    if (!isValid) checkStore(store);

    checkKey(key);

    if (Reflect.has(store.injectedSagas, key)) {
      const descriptor = store.injectedSagas[key];
      if (!descriptor.mode) {
        return;
      }

      if (descriptor.mode === COUNTER) {
        descriptor.count -= 1;

        if (descriptor.count > 0) return;

        descriptor.task.cancel();
        delete store.injectedSagas[key];
      } else if (descriptor.mode !== DAEMON) {
        descriptor.task.cancel();
        // Clean up in production; in development we need `descriptor.saga` for hot reloading
        if (process.env.NODE_ENV === 'production') {
          // Need some value to be able to detect `ONCE_TILL_UNMOUNT` sagas in `injectSaga`
          store.injectedSagas[key] = 'done'; // eslint-disable-line no-param-reassign
        }
      }
    }
  };
}

export default function getInjectors(store) {
  checkStore(store);

  return {
    injectSaga: injectSagaFactory(store, true),
    ejectSaga: ejectSagaFactory(store, true),
  };
}
