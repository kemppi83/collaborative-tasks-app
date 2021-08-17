import * as React from 'react';
import {
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  Center,
  useToast
} from '@chakra-ui/react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { useLoginMutation } from '../../app/services/api';
import type { LoginRequest } from '../../app/services/api';

interface stateType {
  from: { pathname: string };
}

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
    <InputGroup size="md">
      <Input
        pr="4.5rem"
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
        name={name}
        onChange={onChange}
      />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export const Login = (): JSX.Element => {
  const { state } = useLocation<stateType>();
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const toast = useToast();

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
    <Center h="500px">
      <VStack spacing="4">
        <InputGroup>
          <Input
            onChange={handleChange}
            name="email"
            type="text"
            placeholder="Email"
          />
        </InputGroup>

        <InputGroup>
          <PasswordInput onChange={handleChange} name="password" />
        </InputGroup>
        <Button
          isFullWidth
          onClick={async () => {
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
              toast({
                status: 'error',
                title: 'Error',
                description: 'Oh no, there was an error!',
                isClosable: true
              });
            }
          }}
          colorScheme="green"
          isLoading={isLoading}
        >
          Login
        </Button>
      </VStack>
    </Center>
  );
};

export default Login;
