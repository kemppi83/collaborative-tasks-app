import React, { useEffect } from 'react';

import { useTodos } from '../../hooks/useTodos';
import { useAppDispatch } from '../../hooks/store';
import { addTodo, showForm } from './todoSlice';
import { useGetTodosQuery } from '../../app/services/api';
import TodoCard from './TodoCard';

import type { Todo, Task } from '../../app/models';

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
      {todos.map(todo => {
        return todo.status === 'active' ? (
          <TodoCard
            key={todo.id}
            todo={todo}
            socketAddTask={socketAddTask}
            socketUpdateTask={socketUpdateTask}
            socketDeleteTask={socketDeleteTask}
            socketUpdateTodo={socketUpdateTodo}
            socketDeleteTodo={socketDeleteTodo}
          />
        ) : null;
      })}
      {todos.map(todo => {
        return todo.status === 'done' ? (
          <TodoCard
            key={todo.id}
            todo={todo}
            socketAddTask={socketAddTask}
            socketUpdateTask={socketUpdateTask}
            socketDeleteTask={socketDeleteTask}
            socketUpdateTodo={socketUpdateTodo}
            socketDeleteTodo={socketDeleteTodo}
          />
        ) : null;
      })}
    </ul>
  );
};

export default TodoList;
