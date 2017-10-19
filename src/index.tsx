import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App, { reducer, initialState } from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import { Provider } from 'react-redux';
import * as t from 'teadux';

const { enhancer, runtime } = t.install();

const windowIfDefined: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
} =
  window || {};

const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionSanitizer: t.actionSanitizer,
      stateSanitizer: t.makeStateSanitizer(runtime),
    })
  : t.compose;

const store = t.createStore(reducer, initialState, composeEnhancers(enhancer));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
