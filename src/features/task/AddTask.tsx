import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../../hooks/store';
import { addTask } from './taskSlice';
import type { Task } from '../../app/models';
// import SocketHandler from '../../utils/SocketHandler';

interface AddTaskProps {
  todoId: string;
  socketAddTask: (task: Task) => void;
}

const AddTask = ({ todoId, socketAddTask }: AddTaskProps): JSX.Element => {
  const [formState, setFormstate] = useState<Partial<Task>>({
    title: ''
  });
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  // const { socketAddTask } = SocketHandler();

  const handleChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  const taskSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.title) {
      return setError('Task title is required!');
    }

    const newTask = {
      id: uuidv4(),
      title: formState.title,
      timestamp: Date.now(),
      status: 'active',
      parent_todo: todoId
    } as Task;

    setError('');
    dispatch(
      addTask({
        task: newTask
      })
    );

    setFormstate({
      title: ''
    });

    socketAddTask(newTask);
  };

  return (
    <form data-testid="todo-form" onSubmit={taskSubmitHandler}>
      <h3>Register New ToDo</h3>

      <label htmlFor="title">Title:</label>
      <input
        data-testid="title"
        placeholder={error}
        type="text"
        name="title"
        value={formState.title}
        onChange={handleChange}
      />

      <button type="submit" data-testid="submit">
        Add task
      </button>
    </form>
  );
};

export default AddTask;
