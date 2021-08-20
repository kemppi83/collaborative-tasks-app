import React from 'react';
// import Nav from '../features/nav/Nav';
import AddTodo from '../features/todo/AddTodo';
import TodoList from '../features/todo/TodoList';

const Home = (): JSX.Element => {
  return (
    <>
      {/* <Nav /> */}
      <AddTodo />
      <TodoList />
    </>
  );
};

export default Home;
