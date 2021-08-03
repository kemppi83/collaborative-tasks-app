import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export interface User {
  username: string;
  email: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface SignupRequest {
  username?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api/',
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: builder => ({
    signup: builder.mutation<UserResponse, SignupRequest>({
      query: signupData => ({
        url: 'signup',
        method: 'POST',
        body: signupData
      })
    }),
    login: builder.mutation<UserResponse, LoginRequest>({
      query: credentials => ({
        url: 'login',
        method: 'POST',
        body: credentials
      })
    }),
    protected: builder.mutation<{ message: string }, void>({
      query: () => 'protected'
    })
  })
});

export const { useSignupMutation, useLoginMutation, useProtectedMutation } =
  api;
