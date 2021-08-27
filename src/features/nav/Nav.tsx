import React from 'react';
import { useHistory } from 'react-router-dom';
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
    <nav className="flex items-center justify-between flex-wrap bg-teal p-6">
      <div className="flex items-center flex-no-shrink mr-6">
        <span className="font-semibold text-xl tracking-tight">
          Collaborative Tasks
        </span>
      </div>
      <div className="w-full block flex-grow sm:flex sm:items-center sm:w-auto">
        {user ? (
          <div className="text-sm sm:flex-grow">
            <p className="block mt-4 sm:inline-block sm:mt-0 text-teal-lighter mr-4">
              {user.username ? `Hello ${user.username}!` : null}
            </p>
            <button
              type="button"
              onClick={() => push('/')}
              className="block mt-4 sm:inline-block sm:mt-0 text-teal-lighter hover:text-white mr-4"
            >
              Home
            </button>
            <button
              type="button"
              onClick={logoutHandler}
              className="block mt-4 sm:inline-block sm:mt-0 text-teal-lighter hover:text-white mr-4"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-sm sm:flex-grow">
            <button
              type="button"
              onClick={() => push('/login')}
              className="block mt-4 sm:inline-block sm:mt-0 text-teal-lighter hover:text-white mr-4"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => push('/signup')}
              className="block mt-4 sm:inline-block sm:mt-0 text-teal-lighter hover:text-white mr-4"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
