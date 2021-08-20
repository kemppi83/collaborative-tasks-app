import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { PrivateRoute } from './utils/PrivateRoute';
import { useAuth } from './hooks/useAuth';
import { useVerifyTokenQuery } from './app/services/api';
import { useAppDispatch } from './hooks/store';
import { setCredentials, resetCredentials } from './features/auth/authSlice';
import Nav from './features/nav/Nav';

import Home from './pages/Home';

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
      console.log('käyttäjä: ', user);
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
            <Home />
          </PrivateRoute>
        </Switch>
      )}
    </div>
  );
};

export default App;
