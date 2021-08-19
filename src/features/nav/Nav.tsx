import React from 'react';
import { useHistory } from 'react-router-dom';
import { HStack, Button } from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/store';
import { resetTodos } from '../../features/todo/todoSlice';
import { resetCredentials } from '../../features/auth/authSlice';

const Nav = (): JSX.Element => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { push } = useHistory();

  const logoutHandler = () => {
    dispatch(resetTodos());
    dispatch(resetCredentials());
    localStorage.removeItem('token');
    push('/login');
  };

  return (
    <header className="App-header">
      <h1>Welcome to Collaborative Tasks!</h1>
      {user ? (
        <>
          <p>Hello {user ? user.username : null}</p>
          <Button h="1.75rem" size="sm" onClick={logoutHandler}>
            Logout
          </Button>
        </>
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
  );
};

export default Nav;
