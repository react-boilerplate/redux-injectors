import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { App } from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { PeopleManager } from './managers/PeopleManager';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PeopleManager>
        <App />
      </PeopleManager>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
