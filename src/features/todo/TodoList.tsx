import React, { useEffect, useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { useAppDispatch } from '../../hooks/store';
import { addTodo, deleteTodo, showForm } from './todoSlice';
import {
  useGetTodosQuery,
  useUpdateTodoMutation,
  useDbDeleteTodoMutation
} from '../../app/services/api';
import TaskList from '../task/TaskList';
import AddTask from '../task/AddTask';

import type { Todo, Task } from '../../app/models';

import { CheckIcon, XIcon } from '@heroicons/react/solid';

interface TodoListProps {
  socketAddTask: (task: Task) => void;
  socketUpdateTask: (task: Task) => void;
  socketDeleteTask: (taskId: string, todoId: string) => void;
  socketUpdateTodo: (todo: Todo) => void;
  socketDeleteTodo: (todoId: string) => void;
}

const TodoList = ({
  socketAddTask,
  socketUpdateTask,
  socketDeleteTask,
  socketUpdateTodo,
  socketDeleteTodo
}: TodoListProps): JSX.Element => {
  const { todos } = useTodos();
  const dispatch = useAppDispatch();
  const { data } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [dbDeleteTodo] = useDbDeleteTodoMutation();
  const [showTodo, setShowTodo] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      const serverTodos = [...data.todos];
      serverTodos.sort((x, y) => x.timestamp - y.timestamp);
      serverTodos.forEach(serverTodo => {
        if (!todos.find(el => el.id === serverTodo.id)) {
          dispatch(addTodo({ todo: serverTodo }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onChangeStatus = async (todo: Todo) => {
    // dispatch(updateStatus({ todoId: todo.id }));
    console.log('status: ', todo.status);
    try {
      await updateTodo({
        id: todo.id,
        ...(todo.status === 'active'
          ? { status: 'done' }
          : { status: 'active' })
      }).unwrap();
    } catch (err) {
      console.log(err.message);
    }
    socketUpdateTodo(todo);
  };

  const onDeleteTodo = async (id: string) => {
    try {
      await dbDeleteTodo(id).unwrap();
    } catch (err) {
      console.log(err.message);
    }
    dispatch(deleteTodo({ todoId: id }));
    socketDeleteTodo(id);
  };

  const handleExpandTodo = (id: string) => {
    const copyShowList = [...showTodo];
    if (showTodo.includes(id)) {
      const deleteIndex = copyShowList.findIndex(i => i === id);
      copyShowList.splice(deleteIndex, 1);
    } else {
      copyShowList.push(id);
    }
    setShowTodo(copyShowList);
  };

  return (
    <ul className="flex flex-col items-center md:flex-row md:justify-center md:flex-wrap md:items-start">
      {todos.length < 1 ? (
        <div className="mt-5 flex items-center">
          <p>Add your first todo-list by clicking</p>
          <button
            type="button"
            onClick={() => dispatch(showForm())}
            className="p-1 font-bold"
          >
            here
          </button>
        </div>
      ) : null}
      {todos.map(todo => (
        <li
          key={todo.id}
          className={`p-3 grid grid-cols-1 max-w-sm mx-2 my-5 w-full rounded-md ${
            todo.status === 'done' ? 'bg-purple-300' : 'bg-blue-100'
          }`}
        >
          <div>
            <h3 className="text-lg font-semibold">{todo.title}</h3>
            <p className="my-2">{todo.description}</p>
            {showTodo.includes(todo.id) ? (
              <>
                <TaskList
                  todoId={todo.id}
                  socketUpdateTask={socketUpdateTask}
                  socketDeleteTask={socketDeleteTask}
                />
                <AddTask todoId={todo.id} socketAddTask={socketAddTask} />
                {todo.collaborators.length > 0 ? (
                  <h4 className="font-bold">Collaborators</h4>
                ) : null}
                <ul className="list-disc my-2">
                  {todo.collaborators.map(email => (
                    <li key={email} className="ml-5 my-1 flex justify-between">
                      {email}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <div className="flex justify-between items-center">
            {showTodo.includes(todo.id) ? (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
                onClick={() => handleExpandTodo(todo.id)}
              >
                Hide details
              </button>
            ) : (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
                onClick={() => handleExpandTodo(todo.id)}
              >
                Show details
              </button>
            )}
            <div className="flex items-center">
              {todo.status === 'active' ? (
                <CheckIcon
                  type="button"
                  className="cursor-pointer h-7 w-7 text-blue-500 hover:text-blue-700"
                  onClick={() => onChangeStatus(todo)}
                />
              ) : (
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => onChangeStatus(todo)}
                >
                  Reactivate
                </button>
              )}
              <XIcon
                type="button"
                className="ml-3 cursor-pointer h-7 w-7 text-red-500 hover:text-red-700"
                onClick={() => onDeleteTodo(todo.id)}
              />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
