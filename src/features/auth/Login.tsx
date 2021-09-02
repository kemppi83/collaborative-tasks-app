import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { useLoginMutation, useRecoverMutation } from '../../app/services/api';
import type { LoginRequest, RecoveryRequest } from '../../app/models';

interface stateType {
  from: { pathname: string };
}

export const Login = (): JSX.Element => {
  const { state } = useLocation<stateType>();
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const [show, setShow] = useState(false);
  const [showRecoveryEmailForm, setShowRecoveryEmailForm] = useState(false);
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);
  const handleClick = () => setShow(!show);

  const [formState, setFormstate] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [recoveryEmail, setRecoveryEmail] = useState<RecoveryRequest>({
    email: ''
  });

  const [login] = useLoginMutation();
  const [recover] = useRecoverMutation();

  const handleChange = ({
    target: { name, value }
  }: ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  const handleRecoveryEmailChange = ({
    target: { name, value }
  }: ChangeEvent<HTMLInputElement>) =>
    setRecoveryEmail(prev => ({ ...prev, [name]: value }));

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

  const recoverySubmitHandler = async (event: FormEvent) => {
    event.preventDefault();
    try {
      console.log('recoveryEmail: ', recoveryEmail);
      await recover(recoveryEmail).unwrap();
      setRecoveryEmailSent(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex-col gap-6 max-w-sm mx-auto">
      <form
        className="grid grid-cols-1 gap-6 max-w-sm mx-auto items-center"
        onSubmit={loginSubmitHandler}
      >
        <input
          onChange={handleChange}
          name="email"
          type="email"
          placeholder="Email"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
        />
        <div className="flex w-auto items-center">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            name="password"
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
          />
          <button
            type="button"
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-700 text-white ml-2 px-2 rounded h-8"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Login
        </button>
      </form>
      <div className="mt-5 flex items-center">
        <p>Forgot your password?</p>
        <button
          type="button"
          onClick={() => setShowRecoveryEmailForm(!showRecoveryEmailForm)}
          className="p-1 font-bold"
        >
          {showRecoveryEmailForm ? 'Hide' : 'Recover'}
        </button>
      </div>
      {showRecoveryEmailForm ? (
        <form className="" onSubmit={recoverySubmitHandler}>
          <input
            onChange={handleRecoveryEmailChange}
            name="email"
            type="email"
            placeholder="Email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
          />

          <button type="submit" className="mt-3">
            Send recovery email
          </button>
        </form>
      ) : null}
      {recoveryEmailSent ? (
        <p>Recovery email sent to {recoveryEmail.email}!</p>
      ) : null}
    </div>
  );
};

export default Login;
