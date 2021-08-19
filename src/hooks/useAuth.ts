import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCurrentUser,
  selectCurrentToken
} from '../features/auth/authSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAuth = () => {
  const user = useSelector(selectCurrentUser);

  return useMemo(() => ({ user }), [user]);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useToken = () => {
  const token = useSelector(selectCurrentToken);

  return useMemo(() => ({ token }), [token]);
};
