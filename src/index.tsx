import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App, { reducer, initialState, State, Action, Deps, deps } from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import { Provider } from 'react-redux';
import {
  createEnhancer,
  createStore,
  makeSanitizers,
  Runtime,
  compose,
} from 'teadux';

const runtime = new Runtime<State, Action, Deps>(deps);

const windowIfDefined: Window & {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: Function;
} =
  window || {};

const { actionSanitizer, stateSanitizer } = makeSanitizers(runtime, 'nested');

const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionSanitizer: actionSanitizer,
      stateSanitizer: stateSanitizer,
    })
  : compose;

const store = createStore<State, Action, Deps>(
  reducer,
  [initialState, []],
  composeEnhancers(createEnhancer(runtime))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
