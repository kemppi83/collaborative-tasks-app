import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUserTasks } from '../features/task/taskSlice';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTasks = () => {
  const tasks = useSelector(selectCurrentUserTasks);

  return useMemo(() => ({ tasks }), [tasks]);
};
