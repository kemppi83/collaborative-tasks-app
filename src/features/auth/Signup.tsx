import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { useSignupMutation } from '../../app/services/api';
import type { SignupRequest } from '../../app/models';

export const Signup = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const handleClick = () => setShow(!show);

  const [formState, setFormstate] = useState<SignupRequest>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [signup] = useSignupMutation();

  const handleChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  const signupSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (!formState.password) {
        setError('You must give a password.');
      } else if (formState.password !== formState.confirmPassword) {
        setError("Passwords don't match.");
      } else {
        const user = await signup(formState).unwrap();
        dispatch(setCredentials(user));
        localStorage.setItem('token', user.token);
        push('/');
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center w-11/12 max-w-xs mx-auto">
      <div className="mb-5">
        Enter your email and optional username (email will be used as your
        username if left blank).
      </div>
      {error !== '' && <p>{error}</p>}
      <form
        className="flex flex-col justify-center items-center w-full space-y-3"
        onSubmit={signupSubmitHandler}
      >
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
        />
        <div className="flex w-full items-center">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Enter password"
            name="password"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
          />
          <button
            type="button"
            onClick={handleClick}
            className="bg-blue-500 hover:bg-blue-700 text-white ml-2 px-2 rounded h-8"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className="flex w-full">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
