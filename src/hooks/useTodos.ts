import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectCurrentUserTodos,
  selectCurrentShowForm
} from '../features/todo/todoSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTodos = () => {
  const todos = useSelector(selectCurrentUserTodos);

  return useMemo(() => ({ todos }), [todos]);
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useShowForm = () => {
  const show = useSelector(selectCurrentShowForm);

  return useMemo(() => ({ show }), [show]);
};
