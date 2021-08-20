import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../../hooks/store';
import { addTodo } from './todoSlice';
import { usePostTodoMutation } from '../../app/services/api';
import type { Todo } from '../../app/models';

const AddTodo = (): JSX.Element => {
  const [formState, setFormstate] = useState<Partial<Todo>>({
    title: '',
    description: ''
  });
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const [postTodo] = usePostTodoMutation();

  const handleChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  const todoSubmitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.title) {
      return setError('Todo title is required!');
    }

    const newTodo = {
      id: uuidv4(),
      title: formState.title,
      ...(formState.description
        ? { description: formState.description }
        : { description: '' }),
      timestamp: Date.now(),
      status: 'active',
      collaborators: [],
      tasks: [],
      owner: true
    } as Todo;

    setError('');
    dispatch(
      addTodo({
        todo: newTodo
      })
    );

    setFormstate({
      title: '',
      description: ''
    });

    try {
      const postedTodo = await postTodo(newTodo).unwrap();
      console.log(postedTodo);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <form data-testid="todo-form" onSubmit={todoSubmitHandler}>
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

      <label htmlFor="description">Text:</label>
      <input
        data-testid="description"
        type="text"
        name="description"
        value={formState.description}
        onChange={handleChange}
      />

      <button type="submit" data-testid="submit">
        Add todo
      </button>
    </form>
  );
};

export default AddTodo;
