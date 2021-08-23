import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { useLoginMutation } from '../../app/services/api';
import type { LoginRequest } from '../../app/models';

interface stateType {
  from: { pathname: string };
}

export const Login = (): JSX.Element => {
  const { state } = useLocation<stateType>();
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const [formState, setFormstate] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [login] = useLoginMutation();

  const handleChange = ({
    target: { name, value }
  }: ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  const loginSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const user = await login(formState).unwrap();
      dispatch(setCredentials(user));
      console.log('login: ', user);
      localStorage.setItem('token', user.token);
      let returnUrl = '/';
      if (state && state.from && state.from.pathname) {
        returnUrl = state.from.pathname;
      }
      push(returnUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      className="grid grid-cols-1 gap-6 max-w-sm mx-auto"
      onSubmit={loginSubmitHandler}
    >
      <input
        onChange={handleChange}
        name="email"
        type="email"
        placeholder="Email"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
      />
      <div className="flex w-auto">
        <input
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          name="password"
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
        />
        <button type="button" onClick={handleClick} className="p-1">
          {show ? 'Hide' : 'Show'}
        </button>
      </div>

      <button type="submit" data-testid="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
