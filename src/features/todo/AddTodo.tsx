import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { Todo } from '../../app/services/api';
import { useAppDispatch } from '../../hooks/store';
import { addTodo } from './todoSlice';

const AddTodo = (): JSX.Element => {
  const [formState, setFormstate] = useState<Partial<Todo>>({
    title: '',
    text: ''
  });
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();

  const handleChange = ({
    target: { name, value }
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormstate(prev => ({ ...prev, [name]: value }));

  const todoSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.title) {
      return setError('Todo title is required!');
    }

    setError('');
    dispatch(
      addTodo({
        todo: {
          id: uuidv4(),
          title: formState.title,
          ...(formState.text ? { text: formState.text } : { text: '' }),
          timestamp: Date.now(),
          status: 'active'
        }
      })
    );
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

      <label htmlFor="text">Text:</label>
      <input
        data-testid="text"
        type="text"
        name="text"
        value={formState.text}
        onChange={handleChange}
      />

      <button type="submit" data-testid="submit">
        Add todo
      </button>
    </form>
  );
};

export default AddTodo;
