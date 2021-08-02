// import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { api, User } from '../../app/services/auth';
import type { RootState } from '../../app/store';

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null
};

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (
//       state,
//       { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
//     ) => {
//       state.user = user;
//       state.token = token;
//     }
//   }
// });

// export const { setCredentials } = authSlice.actions;
// export default authSlice.reducer;

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(
      api.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      }
    );
  }
});

export default slice.reducer;
// next line is in both cases present
export const selectCurrentUser = (state: RootState): User | null =>
  state.auth.user;
