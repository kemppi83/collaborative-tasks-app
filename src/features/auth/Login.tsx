import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { ProtectedComponent } from './ProtectedComponent';
import { useLoginMutation } from '../../app/services/auth';
import type { LoginRequest } from '../../app/services/auth';

const PasswordInput = ({
  name,
  onChange
}: {
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <>
      <input
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        name={name}
        onChange={onChange}
      />
      <button onClick={handleClick}>{show ? 'Hide' : 'Show'}</button>
    </>
  );
};

export const Login = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { push } = useHistory();

  const [formState, setFormstate] = React.useState<LoginRequest>({
    email: '',
    password: ''
  });

  const [login, { isLoading }] = useLoginMutation();

  const handleChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  return (
    <>
      <p>Hint: enter anything, or leave it blank and hit login</p>
      <input
        onChange={handleChange}
        name="email"
        type="text"
        placeholder="Email"
      />
      <PasswordInput onChange={handleChange} name="password" />
      <button
        type="button"
        onClick={async () => {
          try {
            const user = await login(formState).unwrap();
            dispatch(setCredentials(user));
            push('/');
          } catch (err) {
            alert('There was an error. Check the console.');
            console.log(err);
          }
        }}
      >
        Login
      </button>
      {isLoading && <p>Logging in...</p>}
      <ProtectedComponent />
    </>
  );
};

export default Login;
