import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { useTasks } from '../../hooks/useTasks';
import { useAppDispatch } from '../../hooks/store';
// import SocketHandler from '../../utils/SocketHandler';
import { addTask, updateTask, deleteTask } from './taskSlice';
import { useToken } from '../../hooks/useAuth';

import type { Task } from '../../app/models';

let url: string;
if (process.env.REACT_APP_SERVER_URL) {
  url = process.env.REACT_APP_SERVER_URL;
} else {
  throw new Error('SERVER_URL environment variable is not set');
}

interface TaskListProps {
  todoId: string;
}

const TaskListIntegrated = ({ todoId }: TaskListProps): JSX.Element => {
  const [thisTodoTasks, setThisTodoTasks] = useState<Task[]>([]);
  const { tasks } = useTasks();
  const dispatch = useAppDispatch();
  // const { socketUpdateTask, socketDeleteTask } = SocketHandler();
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const { token } = useToken();

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
      console.log('täällä emitöidään init');
      socketRef.current.emit('init');

      socketRef.current.on('task:toClient', (tasksFromDB: Task[]) => {
        tasksFromDB.forEach(task => {
          const match = tasks.find(
            (reduxTask: Task) => reduxTask.id === task.id
          );
          if (!match) {
            dispatch(addTask({ task }));
          }
        });
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

  useEffect(() => {
    const filteredTasks = tasks.filter(task => task.parent_todo === todoId);
    setThisTodoTasks(filteredTasks);
  }, [tasks, todoId]);

  const onChangeStatus = async (task: Task) => {
    const updatedTask = { ...task };
    if (task.status === 'active') {
      updatedTask.status = 'done';
    } else {
      updatedTask.status = 'active';
    }
    dispatch(updateTask({ task: updatedTask }));
    // socketUpdateTask(updatedTask);
  };

  const onDeleteTask = async (taskId: string) => {
    dispatch(deleteTask({ taskId }));
    // socketDeleteTask(taskId, todoId);
  };

  return (
    <ul>
      {thisTodoTasks.map(task => (
        <li key={task.id} className={`taskcard__${task.status}`}>
          <p className="taskcard__title">{task.title}</p>
          {task.status === 'active' ? (
            <button
              className="button--done"
              onClick={() => onChangeStatus(task)}
            >
              Mark as done
            </button>
          ) : (
            <button
              className="button--active"
              onClick={() => onChangeStatus(task)}
            >
              Reactivate
            </button>
          )}
          <button
            className="button--delete"
            onClick={() => onDeleteTask(task.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskListIntegrated;
