import React, { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAppDispatch } from '../../hooks/store';
import { updateTask, deleteTask } from './taskSlice';

import type { Task } from '../../app/models';

interface TaskListProps {
  todoId: string;
  socketUpdateTask: (task: Task) => void;
  socketDeleteTask: (taskId: string, todoId: string) => void;
}

const TaskList = ({
  todoId,
  socketUpdateTask,
  socketDeleteTask
}: TaskListProps): JSX.Element => {
  const [thisTodoTasks, setThisTodoTasks] = useState<Task[]>([]);
  const { tasks } = useTasks();
  const dispatch = useAppDispatch();

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
    socketUpdateTask(updatedTask);
  };

  const onDeleteTask = async (taskId: string) => {
    dispatch(deleteTask({ taskId }));
    socketDeleteTask(taskId, todoId);
  };

  return (
    <ul>
      {thisTodoTasks.map(task => (
        <li key={task.id} className={`taskcard__${task.status}`}>
          <p className="taskcard__title">{task.title}</p>
          {task.status === 'active' ? (
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
              onClick={() => onChangeStatus(task)}
            >
              Mark as done
            </button>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
              type="button"
              onClick={() => onChangeStatus(task)}
            >
              Reactivate
            </button>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded"
            type="button"
            onClick={() => onDeleteTask(task.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
