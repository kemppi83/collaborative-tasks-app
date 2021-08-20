import * as React from 'react';
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
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  const [formState, setFormstate] = React.useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  const loginSubmitHandler = async (event: React.FormEvent) => {
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
    <form data-testid="login-form" onSubmit={loginSubmitHandler}>
      <input
        onChange={handleChange}
        name="email"
        type="text"
        placeholder="Email"
      />

      <input
        onChange={handleChange}
        name="password"
        type="password"
        placeholder="Password"
      />

      <input
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        name="password"
        onChange={handleChange}
      />
      <button type="button" onClick={handleClick}>
        {show ? 'Hide' : 'Show'}
      </button>

      <button type="submit" data-testid="submit">
        Login
      </button>
    </form>
  );
};

export default Login;
