import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../../app/services/api';
import type { RootState } from '../../app/store';

interface TodosState {
  todos: Todo[];
}

const storage = localStorage.getItem('todos');

const initialState: TodosState = {
  ...(storage ? { todos: JSON.parse(storage) } : { todos: [] })
};

// WARNING: setTodos overwrites the whole todos state.
const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTodos: (state, { payload: { todo } }: PayloadAction<{ todo: Todo }>) => {
      state.todos.push(todo);
    }
  }
});

export const { setTodos } = todoSlice.actions;
export default todoSlice.reducer;
export const selectCurrentUserTodos = (state: RootState): Todo[] =>
  state.todo.todos;
