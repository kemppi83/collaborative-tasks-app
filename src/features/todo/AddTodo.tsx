import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch } from '../../hooks/store';
import { addTodo, showForm } from './todoSlice';
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
  const [showInfo, setShowInfo] = useState(false);
  const node = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e: MouseEvent) => {
    // console.log(e.target as HTMLDivElement);
    if (
      node &&
      node.current &&
      node.current.contains(e.target as HTMLFormElement)
    ) {
      // inside click
      return;
    }
    // outside click
    dispatch(showForm());
  };

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
    dispatch(showForm());

    try {
      const postedTodo = await postTodo(newTodo).unwrap();
      console.log(postedTodo);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="fixed z-20 min-w-screen h-screen inset-0 flex bg-indigo-700 bg-opacity-95">
      <form
        ref={node}
        className="grid grid-cols-1 max-w-sm w-500 mx-auto my-auto px-3"
        onSubmit={todoSubmitHandler}
      >
        <h3 className="mx-auto text-xl text-white font-bold">
          Add new ToDo-list
        </h3>

        <label htmlFor="title" className="text-white">
          Title:
        </label>
        <input
          placeholder={error}
          type="text"
          name="title"
          value={formState.title}
          onChange={handleChange}
          className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
        />

        <label htmlFor="description" className="text-white">
          Text:
        </label>
        <input
          type="text"
          name="description"
          value={formState.description}
          onChange={handleChange}
          className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
        />

        <div className="flex items-center justify-between">
          <label htmlFor="collaboratorString" className="text-white">
            Collaborators (optional):
          </label>
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 font-bold text-white"
          >
            ?
          </button>
        </div>
        {showInfo && (
          <p>
            You can collaborate with other users in real-time! Add the
            collaborators&apos; email addresses as a comma-separated list. N.b.
            the collaborators have to have an account!
          </p>
        )}
        <input
          type="text"
          name="collaboratorString"
          value={formState.collaboratorString}
          onChange={handleChange}
          className="mt-1 mb-3 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-#1a7aff focus-ring-opacity-50"
        />

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => dispatch(showForm())}
            className="p-1 font-bold text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add todo
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodo;
