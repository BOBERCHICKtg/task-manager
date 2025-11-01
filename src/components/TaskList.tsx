import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Paper,
} from '@mui/material';
// Убрали импорт иконки

interface TaskListProps {
  tasks: any[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          Задачи отсутствуют
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} divider>
            <Checkbox
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {task.title}
                </Typography>
              }
              secondary={
                task.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}
                  >
                    {task.description}
                  </Typography>
                )
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => onDelete(task.id)}
                color="error"
              >
                ❌ {/* Используем эмодзи вместо иконки */}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TaskList;