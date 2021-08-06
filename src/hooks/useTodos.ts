import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUserTodos } from '../features/todo/todoSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTodos = () => {
  const todos = useSelector(selectCurrentUserTodos);

  return useMemo(() => ({ todos }), [todos]);
};

/* Seuraavaksi:
  - tee todo-handlerit
    - kopioi ne vanhan appin reactista (App.tsx)
      - mut nyt ne menee todo komponentteihin
*/
