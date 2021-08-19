import * as React from 'react';
import {
  Input,
  HStack,
  VStack,
  Button,
  Center,
  Box,
  useToast
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/store';
import { setCredentials } from './authSlice';

import { useSignupMutation } from '../../app/services/api';
import type { SignupRequest } from '../../app/models';

const PasswordInput = ({
  onChange
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <HStack justifyContent="center">
      <VStack spacing="2">
        <Input
          pr="4.5rem"
          onChange={onChange}
          name="username"
          type="text"
          placeholder="Username"
        />
        <Input
          pr="4.5rem"
          onChange={onChange}
          name="email"
          type="email"
          placeholder="Email"
        />
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
      </VStack>
      <Box>
        <Button h="1.75rem" size="sm" onClick={handleClick} marginTop="auto">
          {show ? 'Hide' : 'Show'}
        </Button>
      </Box>
    </HStack>
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
      <VStack spacing="2">
        <Box width="500px">
          Enter your email and optional username (email will be used as your
          username if left blank).
        </Box>
        <Box>
          <PasswordInput onChange={handleChange} />
        </Box>
        <Button
          width="200px"
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
          Sign Up
        </Button>
      </VStack>
    </Center>
  );
};

export default Signup;
