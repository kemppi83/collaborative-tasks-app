import React from 'react';
import AddTodo from '../features/todo/AddTodo';
import TodoList from '../features/todo/TodoList';
import SocketHandler from '../utils/SocketHandler';
import { useShowForm } from '../hooks/useTodos';

const Home = (): JSX.Element => {
  const {
    socketAddTask,
    socketUpdateTask,
    socketDeleteTask,
    socketAddTodo,
    socketUpdateTodo,
    socketDeleteTodo
  } = SocketHandler();
  const { show } = useShowForm();

  return (
    <main className="mx-2">
      <TodoList
        socketAddTask={socketAddTask}
        socketUpdateTask={socketUpdateTask}
        socketDeleteTask={socketDeleteTask}
        socketUpdateTodo={socketUpdateTodo}
        socketDeleteTodo={socketDeleteTodo}
      />
      {show && <AddTodo socketAddTodo={socketAddTodo} />}
    </main>
  );
};

export default Home;
