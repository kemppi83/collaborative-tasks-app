import * as React from 'react';
import {
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Button,
  Divider,
  Center,
  Box,
  useToast
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { ProtectedComponent } from './ProtectedComponent';
import { useSignupMutation } from '../../app/services/auth';
import type { SignupRequest } from '../../app/services/auth';

const PasswordInput = ({
  onChange
}: {
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
        name={'password'}
        onChange={onChange}
      />
      <Input
        pr="4.5rem"
        type={show ? 'text' : 'password'}
        placeholder="Confirm password"
        name={'confirmPassword'}
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

export const Signup = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { push } = useHistory();
  const toast = useToast();

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

  return (
    <Center h="500px">
      <VStack spacing="4">
        <Box>
          Enter your email and optional username (email will be used as your
          username if left blank.
        </Box>
        <InputGroup>
          <Input
            onChange={handleChange}
            name="username"
            type="text"
            placeholder="Username"
          />
          <Input
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Email"
          />
        </InputGroup>

        <InputGroup>
          <PasswordInput onChange={handleChange} />
        </InputGroup>
        <Button
          isFullWidth
          onClick={async () => {
            try {
              const user = await signup(formState).unwrap();
              dispatch(setCredentials(user));
              push('/');
            } catch (err) {
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
        <Divider />
        <ProtectedComponent />
      </VStack>
    </Center>
  );
};

export default Signup;
