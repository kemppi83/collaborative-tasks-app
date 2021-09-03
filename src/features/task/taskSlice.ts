import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task } from '../../app/models';
import type { RootState } from '../../app/store';

export interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: []
};

// WARNING: setTodos overwrites the whole todos state.
const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    addTask: (state, { payload: { task } }: PayloadAction<{ task: Task }>) => {
      state.tasks.push(task);
    },
    updateTask: (
      state,
      { payload: { task } }: PayloadAction<{ task: Task }>
    ) => {
      const updatedTasks = [...state.tasks];
      const updateIndex = updatedTasks.findIndex(i => i.id === task.id);
      updatedTasks.splice(updateIndex, 1, task);
      state.tasks = updatedTasks;
    },
    deleteTask: (
      state,
      { payload: { taskId } }: PayloadAction<{ taskId: string }>
    ) => {
      const updatedTasks = [...state.tasks];
      const updateIndex = updatedTasks.findIndex(i => i.id === taskId);
      updatedTasks.splice(updateIndex, 1);
      state.tasks = updatedTasks;
    },
    resetTasks: state => initialState
  }
});

export const { addTask, updateTask, deleteTask, resetTasks } =
  taskSlice.actions;
export default taskSlice.reducer;
export const selectCurrentUserTasks = (state: RootState): Task[] =>
  state.task.tasks;
