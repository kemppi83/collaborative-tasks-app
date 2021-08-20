import React, { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAppDispatch } from '../../hooks/store';
import SocketHandler from '../../utils/SocketHandler';
import { updateTaskStatus } from './taskSlice';

import type { Task } from '../../app/models';

interface TaskListProps {
  todoId: string;
}

const TaskList = ({ todoId }: TaskListProps): JSX.Element => {
  const [thisTodoTasks, setThisTodoTasks] = useState<Task[]>([]);
  const { tasks } = useTasks();
  const dispatch = useAppDispatch();
  const socket = SocketHandler();

  // ONCHANGESTATUS JA ONDELETETODO PITÄÄ MUOKATA TASKEJA VARTEN
  // HUOM! KÄYTÄ SOCKETIN METODEJA!
  // SOCKETHANDLERISSA PITÄÄ MYÖS MUOKATA METODIT ITSELLE SOPIVIKSI
  // SAMOIN BACKENDISSA!

  useEffect(() => {
    const filteredTasks = tasks.filter(task => task.parent_todo === todoId);
    setThisTodoTasks(filteredTasks);
  }, [tasks, todoId]);

  const onChangeStatus = async (task: Task) => {
    dispatch(updateTaskStatus({ taskId: task.id }));
    console.log('status: ', task.status);
    try {
      await updateTodo({
        id: todo.id,
        ...(todo.status === 'active'
          ? { status: 'done' }
          : { status: 'active' })
      }).unwrap();
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
      {thisTodoTasks.map(task => (
        <li key={task.id} className={`taskcard__${task.status}`}>
          <p className="taskcard__title">{task.title}</p>
          <p className="taskcard__text">{task.description}</p>
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
            onClick={() => onDeleteTodo(task.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
