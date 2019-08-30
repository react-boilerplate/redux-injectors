export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

/**
 * All the possible saga injection behaviours
 * @public
 */
export const SagaInjectionModes = {
  RESTART_ON_REMOUNT,
  DAEMON,
  ONCE_TILL_UNMOUNT,
};
