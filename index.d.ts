import { ComponentType } from "react";
import { Reducer } from "redux";
import { Saga, Task } from "redux-saga";

export function forceReducerReload(store: {});
export function setupStoreForInjectors(store: {}, options: { 
  runSaga: <S extends Saga<any[]>>(saga: S, ...args: Parameters<S>) => Task,
  createReducer: (injectedReducers: { [key: string]: Reducer }) => Reducer
});

export enum SagaInjectionModes {
  RESTART_ON_REMOUNT = "@@saga-injector/restart-on-remount",
  DAEMON = "@@saga-injector/daemon",
  ONCE_TILL_UNMOUNT = "@@saga-injector/once-till-unmount"
}

export function injectSaga(options: { key: string, saga: Saga, mode?: SagaInjectionModes }): <T extends ComponentType>(Component: T) => T;
export function injectReducer(options: { key: string, reducer: Reducer }): <T extends ComponentType>(Component: T) => T;
export function useInjectSaga(options: { key: string, saga: Saga, mode?: SagaInjectionModes }): void;
export function useInjectReducer(options: { key: string, reducer: Reducer }): void;
