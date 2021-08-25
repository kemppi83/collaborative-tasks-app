import React from 'react';
import AddTodo from '../features/todo/AddTodo';
import TodoList from '../features/todo/TodoList';
import SocketHandler from '../utils/SocketHandler';

const Home = (): JSX.Element => {
  const {
    socketAddTask,
    socketUpdateTask,
    socketDeleteTask,
    socketAddTodo,
    socketUpdateTodo,
    socketDeleteTodo
  } = SocketHandler();
  return (
    <>
      <TodoList
        socketAddTask={socketAddTask}
        socketUpdateTask={socketUpdateTask}
        socketDeleteTask={socketDeleteTask}
        socketUpdateTodo={socketUpdateTodo}
        socketDeleteTodo={socketDeleteTodo}
      />
      <AddTodo socketAddTodo={socketAddTodo} />
    </>
  );
};

export default Home;
