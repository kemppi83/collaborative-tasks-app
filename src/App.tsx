import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { PrivateRoute } from './utils/PrivateRoute';
import { Counter } from './features/counter/Counter';
import { useAuth } from './hooks/useAuth';
import { useVerifyTokenQuery } from './app/services/api';
import { useAppDispatch } from './hooks/store';
import { setCredentials, resetCredentials } from './features/auth/authSlice';

import Nav from './features/nav/Nav';
import AddTodo from './features/todo/AddTodo';
import TodoList from './features/todo/TodoList';

const App = (): JSX.Element => {
  const [allSetup, setAllSetup] = useState(false);
  const { user } = useAuth();
  const { data, isLoading } = useVerifyTokenQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        dispatch(setCredentials(data));
      } else {
        setAllSetup(true);
      }
    }
    return function cleanup() {
      dispatch(resetCredentials());
    };
  }, [data, dispatch, isLoading]);

  useEffect(() => {
    if (user) {
      setAllSetup(true);
    }
  }, [user]);

  return (
    <div className="App">
      <Nav />
      {allSetup && (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <PrivateRoute exact path="/">
            <AddTodo />
            <TodoList />
          </PrivateRoute>
          <PrivateRoute path="/test">
            <Counter />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
          </PrivateRoute>
        </Switch>
      )}
    </div>
  );
};

export default App;
