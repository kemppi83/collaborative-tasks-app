import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../../hooks/store';
import { addTodo } from './todoSlice';
import { usePostTodoMutation } from '../../app/services/api';
import type { Todo } from '../../app/models';

interface AddTodoProps {
  socketAddTodo: (todo: Todo) => void;
}

const AddTodo = ({ socketAddTodo }: AddTodoProps): JSX.Element => {
  const [formState, setFormstate] = useState<Partial<Todo>>({
    title: '',
    description: '',
    collaboratorString: ''
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
    console.log(formState.collaboratorString);

    const newTodo = {
      id: uuidv4(),
      title: formState.title,
      ...(formState.description
        ? { description: formState.description }
        : { description: '' }),
      timestamp: Date.now(),
      status: 'active',
      ...(formState.collaboratorString
        ? { collaborators: formState.collaboratorString.split(' ') }
        : { collaborators: [] }),
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
      description: '',
      collaboratorString: ''
    });

    socketAddTodo(newTodo);

    try {
      const postedTodo = await postTodo(newTodo).unwrap();
      console.log(postedTodo);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <form
      className="grid grid-cols-1 max-w-sm mx-auto mt-5"
      onSubmit={todoSubmitHandler}
    >
      <h3 className="mx-auto text-xl font-bold">Register New ToDo</h3>

      <label htmlFor="title">Title:</label>
      <input
        placeholder={error}
        type="text"
        name="title"
        value={formState.title}
        onChange={handleChange}
        className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
      />

      <label htmlFor="description">Text:</label>
      <input
        type="text"
        name="description"
        value={formState.description}
        onChange={handleChange}
        className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
      />

      <label htmlFor="collaboratorString">
        Collaborators (email addresses, space separated):
      </label>
      <input
        type="text"
        name="collaboratorString"
        value={formState.collaboratorString}
        onChange={handleChange}
        className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
      />

      <button
        type="submit"
        className="mb-20 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add todo
      </button>
    </form>
  );
};

export default AddTodo;
