export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

/**
 * All the possible saga injection behaviours
 *
 * @property {String} RESTART_ON_REMOUNT The saga will be started on component instantiation and cancelled with
 * `task.cancel()` on component unmount for improved performance.
 * @property {String} DAEMON Causes the saga to be started on component instantiation and never canceled
 * or started again.
 * @property {String} ONCE_TILL_UNMOUNT Behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 * @enum {String}
 * @public
 */
export const SagaInjectionModes = {
  RESTART_ON_REMOUNT,
  DAEMON,
  ONCE_TILL_UNMOUNT,
};
