import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Todo } from '../../app/models';
import type { RootState } from '../../app/store';

interface TodosState {
  todos: Todo[];
  show: boolean;
}

const initialState: TodosState = {
  todos: [],
  show: false,
};

// WARNING: setTodos overwrites the whole todos state.
const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    showForm: (state) => {
      state.show = !state.show;
    },
    addTodo: (state, { payload: { todo } }: PayloadAction<{ todo: Todo }>) => {
      state.todos.push(todo);
    },
    updateStatus: (
      state,
      { payload: { todoId } }: PayloadAction<{ todoId: string }>
    ) => {
      const updatedTodos = [...state.todos];
      const updateIndex = updatedTodos.findIndex(i => i.id === todoId);
      if (updatedTodos[updateIndex].status === 'active') {
        updatedTodos[updateIndex].status = 'done';
      } else {
        updatedTodos[updateIndex].status = 'active';
      }
      state.todos = updatedTodos;
    },
    deleteTodo: (
      state,
      { payload: { todoId } }: PayloadAction<{ todoId: string }>
    ) => {
      const updatedTodos = [...state.todos];
      const updateIndex = updatedTodos.findIndex(i => i.id === todoId);
      if (updateIndex > -1) {
        updatedTodos.splice(updateIndex, 1);
      }
      state.todos = updatedTodos;
    },
    resetTodos: state => initialState
  }
});

export const { showForm, addTodo, updateStatus, deleteTodo, resetTodos } =
  todoSlice.actions;
export default todoSlice.reducer;
export const selectCurrentUserTodos = (state: RootState): Todo[] =>
  state.todo.todos;
export const selectCurrentShowForm = (state: RootState): boolean => state.todo.show;
