import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { useSignupMutation } from '../../app/services/api';
import type { SignupRequest } from '../../app/models';

export const Signup = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [formState, setFormstate] = React.useState<SignupRequest>({
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
      const user = await signup(formState).unwrap();
      dispatch(setCredentials(user));
      push('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-5">
        Enter your email and optional username (email will be used as your
        username if left blank).
      </div>
      <form
        className="grid grid-cols-1 gap-6 max-w-sm mx-auto"
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
        <div className="flex w-auto">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
          />
        </div>
        <button type="submit" data-testid="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
