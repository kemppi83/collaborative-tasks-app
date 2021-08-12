import React from 'react';
import { useTodos } from '../../hooks/useTodos';
import { useAppDispatch } from '../../hooks/store';
import { updateStatus } from './todoSlice';

import { Todo } from '../../app/services/api';
// import './TodoList.css';

const TodoList = (): JSX.Element => {
  const { todos } = useTodos();
  const dispatch = useAppDispatch();

  const onChangeStatus = (id: string): void => {
    console.log(id);
    dispatch(updateStatus({ todoId: id }));
  };

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={`todocard__${todo.status}`}>
          <p className="todocard__title">{todo.title}</p>
          <p className="todocard__text">{todo.text}</p>
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
          {/* <button
            className="button--delete"
            onClick={props.onDeleteTodo.bind(null, todo.id)}
          >
            Delete
          </button> */}
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
export {};
