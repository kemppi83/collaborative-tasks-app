import React, { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { useTodos } from '../../hooks/useTodos';
import { useAppDispatch } from '../../hooks/store';
import { addTodo, updateStatus, deleteTodo } from './todoSlice';
import {
  useGetTodosQuery,
  useUpdateTodoMutation,
  useDbDeleteTodoMutation
} from '../../app/services/api';

/* TODO:
  - data.todos will be split to data.todos.own and data.todos.collaboration
    - render first the own and then the collab
    - only own gets a delete button
    - all todos will get 'add task' button
    - all tasks of both todo types will get 'delete' and 'changestatus' buttons
*/

const TodoList = (): JSX.Element => {
  const { todos } = useTodos();
  const dispatch = useAppDispatch();
  const { data } = useGetTodosQuery();
  const [updateTodo] = useUpdateTodoMutation();
  const [dbDeleteTodo] = useDbDeleteTodoMutation();

  // make a useEffect which calls getTodos and maps over the received todos and adds them to the state
  useEffect(() => {
    if (data) {
      data.todos.forEach(serverTodo => {
        if (!todos.find(el => el.id === serverTodo.id)) {
          dispatch(addTodo({ todo: serverTodo }));
        }
      });
    }
  }, [data, dispatch, todos]);

  const onChangeStatus = async (id: string) => {
    dispatch(updateStatus({ todoId: id }));
    try {
      await updateTodo(id).unwrap();
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

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={`todocard__${todo.status}`}>
          <p className="todocard__title">{todo.title}</p>
          <p className="todocard__text">{todo.description}</p>
          {todo.status === 'active' ? (
            <button
              className="button--done"
              onClick={() => onChangeStatus(todo.id)}
            >
              Mark as done
            </button>
          ) : (
            <button
              className="button--active"
              onClick={() => onChangeStatus(todo.id)}
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
export {};
