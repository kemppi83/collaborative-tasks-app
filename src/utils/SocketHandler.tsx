import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToken } from '../hooks/useAuth';
import type { Task } from '../app/models';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { useTodos } from '../hooks/useTodos';
import { addTask } from '../features/task/taskSlice';
import { useAppDispatch } from '../hooks/store';

let url: string;
if (process.env.REACT_APP_SERVER_URL) {
  url = process.env.REACT_APP_SERVER_URL;
} else {
  throw new Error('SERVER_URL environment variable is not set');
}

type SocketHandlerType = () => {
  handleAddTask: (task: Task) => void;
  handleUpdateTask: (task: Task) => void;
  handleDeleteTask: (
    taskId: string,
    parentTodoId: string,
    parentTaskId?: string
  ) => void;
};

const SocketHandler: SocketHandlerType = () => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const { token } = useToken();
  const { todos } = useTodos();
  const dispatch = useAppDispatch();

  const handleAddTask = (newTask: Task): void => {
    if (socketRef.current) {
      socketRef.current.emit('task:add', newTask);
    }
  };

  const handleUpdateTask = (updatedTask: Task): void => {
    if (socketRef.current) {
      socketRef.current.emit('task:update', updatedTask);
    }
  };

  const handleDeleteTask = (
    taskId: string,
    parentTodoId: string,
    parentTaskId?: string
  ): void => {
    if (socketRef.current) {
      socketRef.current.emit('task:delete', taskId, parentTodoId, parentTaskId);
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

      socketRef.current.on('task:new', (task: Task) => {
        console.log({ task });
        dispatch(addTask({ task }));
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
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask
  };
};

export default SocketHandler;
