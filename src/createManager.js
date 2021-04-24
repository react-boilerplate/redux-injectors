import { useInjectReducer } from "./injectReducer";
import { useInjectSaga } from "./injectSaga";

export function createManager({ name, key, reducer, saga }) {
  function Manager(props) {
    // console.log("rendering", reducer, saga, name, key);
    const isReducerInjected = reducer ? useInjectReducer({ key, reducer }) : true;
    const isSagaInjected = saga ? useInjectSaga({ key, saga }) : true;

    return (isReducerInjected && isSagaInjected) ? props.children : null;
  }

  Manager.displayName = name;

  return Manager;
}
