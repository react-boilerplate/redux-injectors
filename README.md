# injectors
Asynchronous injectors for [redux](https://redux.js.org/) reducers and [redux-saga](https://redux-saga.js.org/) sagas. Allows adding reducers/sagas as needed instead of loading all reducers/sagas upfront. As used by react-boilerplate.

## Getting Started
```bash
npm install injectors # (or yarn add injectors)
```

### Setting up the redux store
The redux store needs to be configured to allow this library to work. The library exports a store enhancer that can be passed to the `createStore` function.
```js
import { createStore } from "redux";
import { createInjectorsEnhancer } from "injectors";

const store = createStore(
 createReducer(),
 undefined,
 createInjectorsEnhancer({
   createReducer,
   runSaga,
 })
)
```

Note the `createInjectorsEnhancer` function takes two options. `createReducer` should be a function that when called will create the root reducer. It's passed the injected reducers as an object of key-reducer pairs.

```js
function createReducer(injectedReducers = {}) {
 const rootReducer = combineReducers({
   ...injectedReducers,
   // other non-injected reducers can go here...
 });

 return rootReducer
}
```

`runSaga` should ussually be `sagaMiddleware.run`. 

```js
  const runSaga = sagaMiddleware.run;
```

### Injecting your first reducer and saga
After setting up the store, you will be able to start injecting reducers and sagas.
```js
import { compose } from "redux";
import { injectReducer, injectSaga } from "injectors";

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

## Documentation
See the [**API reference**](docs/api.md)

## Motivation
There's a few reasons why you might not want to load all your reducers and sagas upfront:
1. You don't need all the reducers and sagas for every page. This library let's you only load the reducers/sagas that are needed for the page being viewed. This speeds up the page load time because you can take advantage of [code-splitting](https://webpack.js.org/guides/code-splitting/).  This is also good for performance after the page has loaded, because less reducers and sagas are running. 
2. You don't want to have to manage a big list of reducers/sagas. This library let's components inject their own reducers/sagas, so you don't need to worry about adding reducers/sagas to a global list.
