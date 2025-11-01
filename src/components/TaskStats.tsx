import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Task } from '@/types/task';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const pending = total - completed;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
        <div>
          <Typography variant="h6" color="primary">
            {total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Всего
          </Typography>
        </div>
        <div>
          <Typography variant="h6" color="success.main">
            {completed}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Выполнено
          </Typography>
        </div>
        <div>
          <Typography variant="h6" color="warning.main">
            {pending}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            В процессе
          </Typography>
        </div>
      </Box>
    </Paper>
  );
};

export default TaskStats;