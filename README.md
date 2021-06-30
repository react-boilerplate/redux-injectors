# <img src="https://raw.githubusercontent.com/react-boilerplate/redux-injectors/3d1e0d2be038bc710c5f319ca680dd6a1e88d5e8/img/logo.svg?sanitize=true" alt="alt text" width="400"></img>
<img src="https://travis-ci.org/react-boilerplate/redux-injectors.svg?branch=master" alt="build status"></img>

Dynamically load [redux](https://redux.js.org/) reducers and [redux-saga](https://redux-saga.js.org/) sagas as needed, instead of loading them all upfront. This has some nice benefits, such as avoiding having to manage a big global list of reducers and sagas. It also allows more effective use of [code-splitting](https://webpack.js.org/guides/code-splitting/). See [motivation](#Motivation). As used by [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate).

## Getting Started
```bash
npm install redux-injectors # (or yarn add redux-injectors)
```

### Setting up the redux store
The redux store needs to be configured to allow this library to work. The library exports a store enhancer that can be passed to the `createStore` function.
```js
import { createStore } from "redux";
import { createInjectorsEnhancer } from "redux-injectors";

const store = createStore(
 createReducer(),
 initialState,
 createInjectorsEnhancer({
   createReducer,
   runSaga,
 })
)
```

Note the `createInjectorsEnhancer` function takes two options. `createReducer` should be a function that when called will return the root reducer. It's passed the injected reducers as an object of key-reducer pairs.

```js
function createReducer(injectedReducers = {}) {
 const rootReducer = combineReducers({
   ...injectedReducers,
   // other non-injected reducers can go here...
 });

 return rootReducer
}
```

`runSaga` should usually be `sagaMiddleware.run`. 

```js
  const runSaga = sagaMiddleware.run;
```

### Redux DevTools
If you're using redux devtools, it's **important to set `shouldHotReload` to false**.  This is because otherwise, redux devtools will re-dispatch previous actions when reducers are injected, causing unexpected behavior.

If using redux-toolkit:
```js
  const store = configureStore({
    devTools: {
      shouldHotReload: false
    }
  })
```

If not using redux-toolkit:
```js
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
  shouldHotReload: false
});

const store = createStore(reducer, composeEnhancers(
  ...
));
```

Unfortunately this causes a separate issue where the action history is cleared when a reducer is injected, **but it's still strongly recommended to set `shouldHotReload` to false**.  There's an [open issue in the redux-devtools repo about this](https://github.com/reduxjs/redux-devtools/issues/378).

### Injecting your first reducer and saga
After setting up the store, you will be able to start injecting reducers and sagas.
```js
import { compose } from "redux";
import { injectReducer, injectSaga } from "redux-injectors";

class BooksManager extends React.PureComponent {
 render() {
   return null;
 }
}

export default compose(
  injectReducer({ key: "books", reducer: booksReducer }),
  injectSaga({ key: "books", saga: booksSaga })
)(BooksManager);

```

Or, using hooks:
```js
import { useInjectReducer, useInjectSaga } from "redux-injectors";

export default function BooksManager() {
  useInjectReducer({ key: "books", reducer: booksReducer });
  useInjectSaga({ key: "books", saga: booksSaga });

  return null;
}
```

**Note:** while the above usage should work in most cases, you might find your reducers/sagas aren't being injected in time to receive an action.  This can happen, for example, if you dispatch an action inside a `useLayoutEffect` instead of a `useEffect`.  In that case, `useInjectReducer` and `useInjectSaga` return boolean flags that are `true` once the reducers/sagas have finished injecting.  You can check these before rendering children that depend on these reducers/sagas being injected.

```js
import { useInjectReducer, useInjectSaga } from "redux-injectors";

export default function BooksManager(props) {
  const reducerInjected = useInjectReducer({ key: "books", reducer: booksReducer });
  const sagaInjected = useInjectSaga({ key: "books", saga: booksSaga });

  if (!reducerInjected || !sagaInjected) {
    return null;
  }

  return (
    <>
      {props.children}
    </>
  );
}
```


## Documentation
See the [**API reference**](docs/api.md)  
Or the [**example**](example)

## Motivation
There's a few reasons why you might not want to load all your reducers and sagas upfront:
1. You don't need all the reducers and sagas for every page. This library lets you only load the reducers/sagas that are needed for the page being viewed. This speeds up the page load time because you can take advantage of [code-splitting](https://webpack.js.org/guides/code-splitting/).  This is also good for performance after the page has loaded, because fewer reducers and sagas are running. 
2. You don't want to have to manage a big list of reducers/sagas. This library lets components inject their own reducers/sagas, so you don't need to worry about adding reducers/sagas to a global list.
