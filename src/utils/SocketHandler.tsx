import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToken } from '../hooks/useAuth';
import type { Task } from '../app/models';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { addTask, updateTask, deleteTask } from '../features/task/taskSlice';
import { useAppDispatch } from '../hooks/store';
import { useTasks } from '../hooks/useTasks';

let url: string;
if (process.env.REACT_APP_SERVER_URL) {
  url = process.env.REACT_APP_SERVER_URL;
} else {
  throw new Error('SERVER_URL environment variable is not set');
}

type SocketHandlerType = () => {
  socketAddTask: (task: Task) => void;
  socketUpdateTask: (task: Task) => void;
  socketDeleteTask: (taskId: string, todoId: string) => void;
};

const SocketHandler: SocketHandlerType = () => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const { token } = useToken();
  const dispatch = useAppDispatch();
  const { tasks } = useTasks();

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

      socketRef.current.on('task:toClient', (tasksFromDB: Task) => {
        const match = tasks.find(
          (reduxTask: Task) => reduxTask.id === tasksFromDB.id
        );
        if (!match) {
          dispatch(addTask({ task: tasksFromDB }));
        }
      });

      socketRef.current.on('task:serverUpdated', (task: Task) => {
        dispatch(updateTask({ task }));
      });

      socketRef.current.on('task:serverDeleted', (taskId: string) => {
        dispatch(deleteTask({ taskId }));
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
    socketDeleteTask
  };
};

export default SocketHandler;
