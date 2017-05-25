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

export const store = stores.store;

const Routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="/counter" component={Counter} />
  </Route>
);

Mousetrap.bind('k', () => store.prevPage());
Mousetrap.bind('j', () => store.nextPage());
Mousetrap.bind('c', () => store.addSelection());

store.getFiles('/Users/stian/Downloads');
store.getBib('/Users/stian/Dropbox/Public/short.bib');

render(
  <div>
    <Router history={hashHistory} routes={Routes} />
  </div>,
  document.getElementById('root')
);
