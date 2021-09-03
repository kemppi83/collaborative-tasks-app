import React, { useState } from 'react';

import {
  useUpdateTodoMutation,
  useDbDeleteTodoMutation
} from '../../app/services/api';
import { deleteTodo } from './todoSlice';
import { useAppDispatch } from '../../hooks/store';
import TaskList from '../task/TaskList';
import AddTask from '../task/AddTask';
import type { Todo, Task } from '../../app/models';
import Close from '../buttons/Close';
import Check from '../buttons/Check';

interface TodoCardProps {
  todo: Todo;
  socketAddTask: (task: Task) => void;
  socketUpdateTask: (task: Task) => void;
  socketDeleteTask: (taskId: string, todoId: string) => void;
  socketUpdateTodo: (todo: Todo) => void;
  socketDeleteTodo: (todoId: string) => void;
}

const TodoCard = ({
  todo,
  socketAddTask,
  socketUpdateTask,
  socketDeleteTask,
  socketUpdateTodo,
  socketDeleteTodo
}: TodoCardProps): JSX.Element => {
  const [showTodo, setShowTodo] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [updateTodo] = useUpdateTodoMutation();
  const [dbDeleteTodo] = useDbDeleteTodoMutation();

  const onChangeStatus = async (todo: Todo) => {
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
                <li key={email} className="mb-4 flex justify-between text-sm">
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
            <div onClick={() => onChangeStatus(todo)}>
              <Check
                classString={
                  'cursor-pointer h-7 w-7 fill-current stroke-current stroke-0 text-blue-500 hover:text-blue-700'
                }
              />
            </div>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => onChangeStatus(todo)}
            >
              Reactivate
            </button>
          )}
          <div onClick={() => onDeleteTodo(todo.id)} className="ml-3">
            <Close
              classString={
                'cursor-pointer h-7 w-7 fill-current stroke-current stroke-0 text-red-500 hover:text-red-700'
              }
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default TodoCard;
