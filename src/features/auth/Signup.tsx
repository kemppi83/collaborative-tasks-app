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

  const [signup, { isLoading }] = useSignupMutation();

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
    <div>
      <div>
        Enter your email and optional username (email will be used as your
        username if left blank).
      </div>
      <form data-testid="signup-form" onSubmit={signupSubmitHandler}>
        <input
          name="username"
          type="text"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          name={'password'}
          type={show ? 'text' : 'password'}
          placeholder="Enter password"
          onChange={handleChange}
        />
        <input
          name={'confirmPassword'}
          type={show ? 'text' : 'password'}
          placeholder="Confirm password"
          onChange={handleChange}
        />
        <button type="button" onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </button>
        <button type="submit" data-testid="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
