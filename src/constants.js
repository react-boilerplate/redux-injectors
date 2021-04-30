export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';
export const COUNTER = '@@saga-injector/counter';

export const COUNTER_PROP = `${COUNTER}:value`;

/**
 * An enum of all the possible saga injection behaviours
 *
 * @property {String} RESTART_ON_REMOUNT The saga will be started on component instantiation and cancelled with
 * `task.cancel()` on component unmount for improved performance.
 * @property {String} DAEMON Causes the saga to be started on component instantiation and never canceled
 * or started again.
 * @property {String} ONCE_TILL_UNMOUNT Behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 * @property {String} COUNTER The saga will be mounted similar to 'RESTART_ON_REMOUNT', only difference is that
 * saga will be mounted only once on first inject, and ejected when all injectors are unmounted.
 * So this enables you to have multiple injectors with same saga and key, only one instance of saga will run
 * and enables you to have system that are more similar to widgets
 *
 * @enum
 * @public
 */
export const SagaInjectionModes = {
  RESTART_ON_REMOUNT,
  DAEMON,
  ONCE_TILL_UNMOUNT,
  COUNTER,
};
