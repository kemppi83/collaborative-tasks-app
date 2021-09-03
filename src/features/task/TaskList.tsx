import React, { useEffect, useState } from 'react';

import { useTasks } from '../../hooks/useTasks';
import { useAppDispatch } from '../../hooks/store';
import { updateTask, deleteTask } from './taskSlice';
import Close from '../buttons/Close';
import Check from '../buttons/Check';

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
                <div onClick={() => onChangeStatus(task)}>
                  <Check
                    classString={
                      'cursor-pointer h-5 w-5 fill-current stroke-current stroke-0 text-blue-500 hover:text-blue-700'
                    }
                  />
                </div>
              ) : (
                <button
                  className=" hover:text-blue-700 text-blue-500 text-xs py-1 px-2 rounded"
                  type="button"
                  onClick={() => onChangeStatus(task)}
                >
                  Reactivate
                </button>
              )}
              <div onClick={() => onDeleteTask(task.id)}>
                <Close
                  classString={
                    'cursor-pointer h-5 w-5 fill-current stroke-current stroke-0 text-red-500 hover:text-red-700'
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TaskList;
