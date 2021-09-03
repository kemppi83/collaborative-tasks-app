import { v4 as uuidv4 } from 'uuid';
import taskReducer, { addTask, updateTask, deleteTask } from './taskSlice';
import type { TasksState } from './taskSlice';
import type { Task } from '../../app/models';

describe('task reducer', () => {
  const initialState: TasksState = {
    tasks: []
  };
  const newTask = {
    id: uuidv4(),
    title: 'Test task',
    timestamp: Date.now(),
    status: 'active',
    parent_todo: uuidv4()
  } as Task;

  it('should handle initial state', () => {
    expect(taskReducer(undefined, { type: 'unknown' })).toEqual({
      tasks: []
    });
  });

  it('should add task', () => {
    const newState = taskReducer(
      initialState,
      addTask({
        task: newTask
      })
    );
    const addedTask = newState.tasks.find(task => task.id === newTask.id);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(Object.keys(addedTask!).length).toEqual(5);
  });

  it('should update task', () => {
    const currentState = { tasks: [newTask] };
    const updatedTask = { ...newTask };
    updatedTask.status = 'done';
    const newState = taskReducer(
      currentState,
      updateTask({
        task: updatedTask
      })
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(
      newState.tasks.find(task => task.id === updatedTask.id)?.status
    ).toEqual('done');
  });

  it('should delete task', () => {
    const currentState = { tasks: [newTask] };
    const newState = taskReducer(
      currentState,
      deleteTask({ taskId: newTask.id })
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(newState.tasks.length).toEqual(0);
  });
});
