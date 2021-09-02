import React, { useEffect, useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useAppDispatch } from '../../hooks/store';
import { updateTask, deleteTask } from './taskSlice';

import type { Task } from '../../app/models';

import { CheckIcon, XIcon } from '@heroicons/react/solid';

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
    <>
      {thisTodoTasks.length > 0 ? <h4 className="font-bold">Tasks</h4> : null}
      <ul
        className={`mt-2 mb-4 py-1 rounded px-1 ${
          thisTodoTasks.length > 0 ? 'bg-blue-200' : null
        }`}
      >
        {thisTodoTasks.map(task => (
          <li
            key={task.id}
            className="my-3 flex justify-between border-b border-indigo-700 border-dashed"
          >
            <p
              className={`text-base max-w-xs ${
                task.status === 'done' ? 'italic line-through' : null
              }`}
            >
              {task.title}
            </p>
            <div className="flex items-center">
              {task.status === 'active' ? (
                <CheckIcon
                  type="button"
                  className="cursor-pointer h-5 w-5 text-blue-500 hover:text-blue-700"
                  onClick={() => onChangeStatus(task)}
                />
              ) : (
                <button
                  className=" hover:text-blue-700 text-blue-500 text-xs py-1 px-2 rounded"
                  type="button"
                  onClick={() => onChangeStatus(task)}
                >
                  Reactivate
                </button>
              )}
              <XIcon
                type="button"
                className="cursor-pointer h-5 w-5 text-red-500 hover:text-red-700"
                onClick={() => onDeleteTask(task.id)}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
