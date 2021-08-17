import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../../hooks/store';
import { addTodo } from './todoSlice';
import { usePostTodoMutation } from '../../app/services/api';
import type { Todo } from '../../app/services/api';

const AddTodo = (): JSX.Element => {
  const [formState, setFormstate] = useState<Partial<Todo>>({
    title: '',
    text: ''
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
      ...(formState.text ? { text: formState.text } : { text: '' }),
      timestamp: Date.now(),
      status: 'active'
    } as Todo;

    setError('');
    dispatch(
      addTodo({
        todo: newTodo
      })
    );

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
