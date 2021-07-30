import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Login } from './features/auth/Login';
import { PrivateRoute } from './utils/PrivateRoute';
import { ProtectedComponent } from './features/auth/ProtectedComponent';
import logo from './logo.svg';
import { Counter } from './features/counter/Counter';
import './App.css';

const App = (): JSX.Element => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/">
          <p>Hooray you logged in!</p>
          <ProtectedComponent />
        </PrivateRoute>
      </Switch>
    </div>
  );
};

export default App;
