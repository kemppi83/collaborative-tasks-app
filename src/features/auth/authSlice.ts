import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../app/services/api';
import type { RootState } from '../../app/store';

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = user;
      state.token = token;
    },
    resetCredentials: state => initialState
  }
});

export const { setCredentials, resetCredentials } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state: RootState): User | null =>
  state.auth.user;
export const selectCurrentToken = (state: RootState): string | null =>
  state.auth.token;
