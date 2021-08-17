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

export interface Todo {
  id: string;
  title: string;
  text: string;
  timestamp: number;
  status: string;
}

interface GetTodosResponse {
  todos: Todo[];
}

interface CreateTodoResponse {
  message: string;
  createdTodo: Todo;
}

interface UpdateTodoResponse {
  message: string;
  updatedTodo: Todo;
}

interface DeleteTodoResponse {
  message: string;
}

let url = 'http://localhost:3001/api/';
if (process.env.NODE_ENV === 'production') {
  url = 'Add url here when the server is deployed.';
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
    updateTodo: builder.mutation<UpdateTodoResponse, string>({
      query: id => ({
        url: `todos/${id}`,
        method: 'PATCH'
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
