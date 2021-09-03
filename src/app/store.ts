import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { api } from './services/api';
import authReducer from '../features/auth/authSlice';
import todoReducer from '../features/todo/todoSlice';
import taskReducer from '../features/task/taskSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    todo: todoReducer,
    task: taskReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
