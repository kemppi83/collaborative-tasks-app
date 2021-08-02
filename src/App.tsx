import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Box, Center, VStack } from '@chakra-ui/react';

import { Login } from './features/auth/Login';
import { PrivateRoute } from './utils/PrivateRoute';
import { ProtectedComponent } from './features/auth/ProtectedComponent';
import { Counter } from './features/counter/Counter';
import './App.css';

const Hooray = () => {
  return (
    <Center h="500px">
      <VStack>
        <Box>Hooray you logged in!</Box>
        <Box>
          <ProtectedComponent />
        </Box>
      </VStack>
    </Center>
  );
};

const App = (): JSX.Element => {
  return (
    <div className="App">
      <header className="App-header">
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
      </header>
      <Switch>
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/">
          <Hooray />
        </PrivateRoute>
      </Switch>
    </div>
  );
};

export default App;
