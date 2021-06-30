import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useStore, ReactReduxContext } from 'react-redux';

import getInjectors from './reducerInjectors';

/**
 * A higher-order component that dynamically injects a reducer when the
 * component is instantiated
 *
 * @param {Object} params
 * @param {string} params.key The key to inject the reducer under
 * @param {function} params.reducer The reducer that will be injected
 *
 * @example
 *
 * class BooksManager extends React.PureComponent {
 *   render() {
 *     return null;
 *   }
 * }
 *
 * export default injectReducer({ key: "books", reducer: booksReducer })(BooksManager)
 *
 * @public
 */
export default ({ key, reducer }) => WrappedComponent => {
  class ReducerInjector extends React.Component {
    static WrappedComponent = WrappedComponent;

    static contextType = ReactReduxContext;

    static displayName = `withReducer(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    constructor(props, context) {
      super(props, context);

      getInjectors(context.store).injectReducer(key, reducer);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(ReducerInjector, WrappedComponent);
};

/**
 * A react hook that dynamically injects a reducer when the hook is run
 *
 * @param {Object} params
 * @param {string} params.key The key to inject the reducer under
 * @param {function} params.reducer The reducer that will be injected
 *
 * @example
 *
 * function BooksManager() {
 *   useInjectReducer({ key: "books", reducer: booksReducer })
 *
 *   return null;
 * }
 *
 * @returns {boolean} flag indicating whether or not the reducer has finished injecting
 * @public
 */
const useInjectReducer = ({ key, reducer }) => {
  const store = useStore();
  const [isInjected, setIsInjected] = React.useState(false);

  React.useLayoutEffect(() => {
    getInjectors(store).injectReducer(key, reducer);
    setIsInjected(true);
  }, []);

  return isInjected;
};

export { useInjectReducer };
