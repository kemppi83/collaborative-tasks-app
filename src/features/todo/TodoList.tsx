import React, { useEffect, useState } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { useAppDispatch } from '../../hooks/store';
import { addTodo, updateStatus, deleteTodo } from './todoSlice';
import {
  useGetTodosQuery,
  useUpdateTodoMutation,
  useDbDeleteTodoMutation
} from '../../app/services/api';
import SocketHandler from '../../utils/SocketHandler';
import TaskList from '../task/TaskList';
import AddTask from '../task/AddTask';

import type { Todo } from '../../app/models';

const TodoList = (): JSX.Element => {
  const { todos } = useTodos();
  const dispatch = useAppDispatch();
  const { data } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [dbDeleteTodo] = useDbDeleteTodoMutation();
  const { socketAddTask, socketUpdateTask, socketDeleteTask } = SocketHandler();
  const [showTodo, setShowTodo] = useState<string[]>([]);

  useEffect(() => {
    if (data) {
      data.todos.forEach(serverTodo => {
        if (!todos.find(el => el.id === serverTodo.id)) {
          dispatch(addTodo({ todo: serverTodo }));
        }
      });
    }
  }, [data, dispatch, todos]);

  const onChangeStatus = async (todo: Todo) => {
    dispatch(updateStatus({ todoId: todo.id }));
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
  };

  const onDeleteTodo = async (id: string) => {
    try {
      await dbDeleteTodo(id).unwrap();
    } catch (err) {
      console.log(err.message);
    }
    dispatch(deleteTodo({ todoId: id }));
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
    <ul className="flex flex-col">
      {todos.map(todo => (
        <li key={todo.id} className={`todocard__${todo.status}`}>
          <p className="todocard__title">{todo.title}</p>
          <p className="todocard__text">{todo.description}</p>
          {showTodo.includes(todo.id) ? (
            <>
              <button
                className="button--delete"
                onClick={() => handleExpandTodo(todo.id)}
              >
                Hide details
              </button>
              <TaskList
                todoId={todo.id}
                socketUpdateTask={socketUpdateTask}
                socketDeleteTask={socketDeleteTask}
              />
              <AddTask todoId={todo.id} socketAddTask={socketAddTask} />
            </>
          ) : (
            <button
              className="button--delete"
              onClick={() => handleExpandTodo(todo.id)}
            >
              Show details
            </button>
          )}
          {todo.status === 'active' ? (
            <button
              className="button--done"
              onClick={() => onChangeStatus(todo)}
            >
              Mark as done
            </button>
          ) : (
            <button
              className="button--active"
              onClick={() => onChangeStatus(todo)}
            >
              Reactivate
            </button>
          )}
          <button
            className="button--delete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
