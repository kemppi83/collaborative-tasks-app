import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToken } from '../hooks/useAuth';
import type { Todo, Task } from '../app/models';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { addTask, updateTask, deleteTask } from '../features/task/taskSlice';
import { useAppDispatch } from '../hooks/store';
import { useTasks } from '../hooks/useTasks';
import { useTodos } from '../hooks/useTodos';
import { addTodo, updateStatus, deleteTodo } from '../features/todo/todoSlice';

let url: string;
if (process.env.NODE_ENV === 'production') {
  if (!process.env.REACT_APP_SERVER_URL_PROD) {
    throw new Error('Server URL not provided');
  }
  url = process.env.REACT_APP_SERVER_URL_PROD;
} else {
  if (!process.env.REACT_APP_SERVER_URL_DEV) {
    throw new Error('Server URL not provided');
  }
  url = process.env.REACT_APP_SERVER_URL_DEV;
}

type SocketHandlerType = () => {
  socketAddTask: (task: Task) => void;
  socketUpdateTask: (task: Task) => void;
  socketDeleteTask: (taskId: string, todoId: string) => void;
  socketAddTodo: (todo: Todo) => void;
  socketUpdateTodo: (todo: Todo) => void;
  socketDeleteTodo: (todoId: string) => void;
};

const SocketHandler: SocketHandlerType = () => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const { token } = useToken();
  const dispatch = useAppDispatch();
  const { tasks } = useTasks();
  const { todos } = useTodos();

  const socketAddTask = (newTask: Task): void => {
    if (socketRef.current) {
      socketRef.current.emit('task:add', newTask);
    }
  };

  const socketUpdateTask = (updatedTask: Task): void => {
    if (socketRef.current) {
      socketRef.current.emit('task:update', updatedTask);
    }
  };

  const socketDeleteTask = (taskId: string, todoId: string): void => {
    if (socketRef.current) {
      socketRef.current.emit('task:delete', taskId, todoId);
    }
  };

  const socketAddTodo = (newTodo: Todo): void => {
    if (socketRef.current) {
      socketRef.current.emit('todo:add', newTodo);
      socketRef.current.emit('todo:subscribe', newTodo.id);
    }
  };

  const socketUpdateTodo = (updatedTodo: Todo): void => {
    if (socketRef.current) {
      socketRef.current.emit('todo:update', updatedTodo);
    }
  };

  // const socketSubscribeToTodo = (newTodo: Todo): void => {
  //   if (socketRef.current) {
  //     socketRef.current.emit('todo:add', newTodo);
  //   }
  // };

  const socketDeleteTodo = (todoId: string): void => {
    if (socketRef.current) {
      console.log('in socketDeleteTodo, id: ', todoId);
      socketRef.current.emit('todo:delete', todoId);
    }
  };

  useEffect(() => {
    const socket = io(url, {
      auth: {
        token
      }
    });
    if (socket) {
      socketRef.current = socket;
    }

    if (socketRef.current) {
      socketRef.current.emit('init');

      socketRef.current.on('task:toClient', (taskFromDB: Task) => {
        const match = tasks.find(
          (reduxTask: Task) => reduxTask.id === taskFromDB.id
        );
        if (!match) {
          dispatch(addTask({ task: taskFromDB }));
        }
      });

      socketRef.current.on('task:serverUpdated', (task: Task) => {
        dispatch(updateTask({ task }));
      });

      socketRef.current.on('task:serverDeleted', (taskId: string) => {
        dispatch(deleteTask({ taskId }));
      });

      socketRef.current.on('todo:toClient', (todoFromDB: Todo) => {
        const match = todos.find(
          (reduxTodo: Todo) => reduxTodo.id === todoFromDB.id
        );
        if (!match) {
          dispatch(addTodo({ todo: todoFromDB }));
        }
        if (socketRef.current) {
          socketRef.current.emit('todo:subscribe', todoFromDB.id);
        }
      });

      socketRef.current.on('todo:serverUpdated', (todo: Todo) => {
        console.log(todo);
        dispatch(updateStatus({ todoId: todo.id }));
      });

      socketRef.current.on('todo:unsubscribe', (todoId: string) => {
        console.log('in todo:unsubscribe, id: ', todoId);
        dispatch(deleteTodo({ todoId }));
        if (socketRef.current) {
          socketRef.current.emit('todo:leave-room', todoId);
        }
      });

      socketRef.current.on('error', (err: Error) => {
        console.error(err);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return {
    socketAddTask,
    socketUpdateTask,
    socketDeleteTask,
    socketAddTodo,
    socketUpdateTodo,
    socketDeleteTodo
  };
};

export default SocketHandler;
