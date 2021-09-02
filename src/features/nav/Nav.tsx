import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { XIcon } from '@heroicons/react/solid';

import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../hooks/store';
import { resetTodos, showForm } from '../../features/todo/todoSlice';
import { resetCredentials } from '../../features/auth/authSlice';

const Nav = (): JSX.Element => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const node = useRef<HTMLDivElement>(null);
  const genericHamburgerLine = `h-1 w-5 my-0.5 rounded-full bg-black transition ease transform duration-300 opacity-50 group-hover:opacity-100`;
  const popupLine = `my-3 text-teal-lighter hover:text-white`;

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const handleClick = (e: MouseEvent) => {
    // console.log(e.target as HTMLDivElement);
    if (
      node &&
      node.current &&
      node.current.contains(e.target as HTMLDivElement)
    ) {
      // inside click
      return;
    }
    // outside click
    setIsOpen(false);
  };

  const logoutHandler = () => {
    dispatch(resetTodos());
    dispatch(resetCredentials());
    localStorage.removeItem('token');
    push('/login');
  };

  return (
    <>
      <nav className="mb-10 py-5 px-3 w-full block flex-wrap flex items-center justify-between w-auto bg-blue-100">
        {user ? (
          <>
            <h1 className="font-semibold text-xl tracking-tight">
              Collaborative Tasks
            </h1>
            <p className="block mt-4 sm:inline-block sm:mt-0 text-teal-lighter mr-4">
              {user.username ? `Hello ${user.username}!` : null}
            </p>
            <button
              className="h-8 w-8 border-2 rounded flex flex-col justify-center items-center group"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className={genericHamburgerLine} />
              <div className={genericHamburgerLine} />
              <div className={genericHamburgerLine} />
            </button>
          </>
        ) : (
          <>
            <h1 className="font-semibold text-xl tracking-tight">
              Collaborative Tasks
            </h1>
            <button
              className="h-8 w-8 border-2 rounded flex flex-col justify-center items-center group"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className={genericHamburgerLine} />
              <div className={genericHamburgerLine} />
              <div className={genericHamburgerLine} />
            </button>
          </>
        )}
      </nav>
      {isOpen ? (
        <div
          ref={node}
          className="fixed w-72 h-screen top-0 right-0 z-10 flex flex-col items-center bg-blue-200 bg-opacity-95"
        >
          <XIcon
            type="button"
            className="cursor-pointer h-10 w-10 text-red-500 hover:text-red-700 ml-auto mr-2 mt-4"
            onClick={() => setIsOpen(!isOpen)}
          />
          {user ? (
            <>
              <button
                type="button"
                onClick={() => push('/')}
                className={popupLine}
              >
                Home
              </button>
              <button
                className={popupLine}
                onClick={() => dispatch(showForm())}
              >
                Add todo-list
              </button>
              <button
                type="button"
                onClick={logoutHandler}
                className={popupLine}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => push('/login')}
                className={popupLine}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => push('/signup')}
                className={popupLine}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Nav;
