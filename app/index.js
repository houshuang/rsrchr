import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { Provider } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
import Mousetrap from 'mousetrap';

import { Home, Counter } from './containers';
import { AppStore, CounterStore, StoreStore } from './stores';

import './app.global.css';

const isDev = process.env.NODE_ENV !== 'production';

const stores = {
  app: new AppStore(),
  counter: new CounterStore(),
  store: new StoreStore()
};
window.store = stores.store;
const App = ({ children }) => (
  <Provider {...stores}>
    {children}
  </Provider>
);

const Routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/counter" component={Counter} />
  </Route>
);

Mousetrap.bind('j', () => stores.store.prevPage());
Mousetrap.bind('k', () => stores.store.nextPage());

stores.store.getFiles('/Users/stian/Downloads');

render(
  <div>
    <Router history={hashHistory} routes={Routes} />
  </div>,
  document.getElementById('root')
);
