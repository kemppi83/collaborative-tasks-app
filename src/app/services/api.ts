import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import type {
  UserResponse,
  SignupRequest,
  LoginRequest,
  Todo,
  GetTodosResponse,
  CreateTodoResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
  DeleteTodoResponse
} from '../models';

let url: string;
if (process.env.NODE_ENV === 'production') {
  if (!process.env.REACT_APP_SERVER_URL_PROD) {
    throw new Error('Server URL not provided');
  }
  url = `${process.env.REACT_APP_SERVER_URL_PROD}/api`;
} else {
  if (!process.env.REACT_APP_SERVER_URL_DEV) {
    throw new Error('Server URL not provided');
  }
  url = `${process.env.REACT_APP_SERVER_URL_DEV}/api`;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      // Otherwise, try if there is a valid token in the localStorage
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      } else {
        const memoryToken = localStorage.getItem('token');
        headers.set('authorization', `Bearer ${memoryToken}`);
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
    verifyToken: builder.query<UserResponse, void>({
      query: () => 'verifytoken'
    }),
    getTodos: builder.query<GetTodosResponse, void>({
      query: () => 'todos'
    }),
    postTodo: builder.mutation<CreateTodoResponse, Todo>({
      query: newTodo => ({
        url: 'todos',
        method: 'POST',
        body: newTodo
      })
    }),
    updateTodo: builder.mutation<UpdateTodoResponse, UpdateTodoRequest>({
      query: updateData => ({
        url: `todos/${updateData.id}`,
        method: 'PATCH',
        body: updateData
      })
    }),
    dbDeleteTodo: builder.mutation<DeleteTodoResponse, string>({
      query: id => ({
        url: `todos/${id}`,
        method: 'DELETE'
      })
    })
  })
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyTokenQuery,
  useGetTodosQuery,
  usePostTodoMutation,
  useUpdateTodoMutation,
  useDbDeleteTodoMutation
} = api;
