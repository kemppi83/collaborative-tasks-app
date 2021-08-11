import React, { useState, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { Box, Center, VStack, HStack, Button } from '@chakra-ui/react';

import { Login } from './features/auth/Login';
import { Signup } from './features/auth/Signup';
import { PrivateRoute } from './utils/PrivateRoute';
import { Counter } from './features/counter/Counter';
import { useAuth } from './hooks/useAuth';
import { useVerifytokenQuery } from './app/services/api';
import { useAppDispatch } from './hooks/store';
import { setCredentials, resetCredentials } from './features/auth/authSlice';

import AddTodo from './features/todo/AddTodo';
// import TodoList from './features/todo/TodoList';

import type { User } from './app/services/api';
// import './App.css';

interface HoorayProps {
  user: User | null;
}

const Hooray = (props: HoorayProps) => {
  return (
    <Center h="500px">
      <VStack>
        <Box>
          Hooray you logged in! {props.user ? props.user.username : null}
        </Box>
      </VStack>
    </Center>
  );
};

const App = (): JSX.Element => {
  const [allSetup, setAllSetup] = useState(false);
  const { push } = useHistory();
  const { user } = useAuth();
  const { data, isLoading } = useVerifytokenQuery();
  const dispatch = useAppDispatch();
  console.log(allSetup);

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

  const logoutHandler = () => {
    dispatch(resetCredentials());
    localStorage.removeItem('token');
    push('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Collaborative Tasks!</h1>
        {user ? (
          <Button h="1.75rem" size="sm" onClick={logoutHandler}>
            Logout
          </Button>
        ) : (
          <HStack>
            <Button h="1.75rem" size="sm" onClick={() => push('/login')}>
              Login
            </Button>
            <Button h="1.75rem" size="sm" onClick={() => push('/signup')}>
              Sign Up
            </Button>
          </HStack>
        )}
      </header>
      {allSetup && (
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <PrivateRoute exact path="/">
            <Hooray user={user} />
          </PrivateRoute>
          <PrivateRoute path="/test">
            <Counter />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
          </PrivateRoute>
          <PrivateRoute path="/todos">
            {/* <AddTodo /> */}
            {/* <TodoList /> */}
            <p>hello</p>
          </PrivateRoute>
        </Switch>
      )}
    </div>
  );
};

export default App;
