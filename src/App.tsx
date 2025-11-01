import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { logout } from './store/slices/authSlice';
import { fetchTasks, createTask, updateTask, deleteTask, clearError } from './store/slices/tasksSlice';

import LoginForm from './components/LogForm';
import RegisterForm from './components/RegForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { items: tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (user && token) {
      console.log('Fetching tasks for user:', user.id);
      dispatch(fetchTasks(user.id) as any);
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    if (error) {
      setNotification({ open: true, message: error, severity: 'error' });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setNotification({ open: true, message: 'Вы вышли из системы', severity: 'success' });
  };

  const handleCreateTask = async (title: string, description: string, dueDate: string, status: string) => {
    try {
      console.log('Creating task with data:', { title, description, dueDate, status });
      
      await dispatch(createTask({ 
        title, 
        description, 
        due_on: dueDate,
        status: status as 'pending' | 'completed'
      }) as any).unwrap();
      
      setTaskFormOpen(false);
      setNotification({ open: true, message: 'Задача создана!', severity: 'success' });
      
      if (user) {
        console.log('Refreshing tasks list for user:', user.id);
        dispatch(fetchTasks(user.id) as any);
      }
    } catch (err: any) {
      console.error('Error creating task:', err);
      setNotification({ open: true, message: err.message || 'Ошибка при создании задачи', severity: 'error' });
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        console.log('Updating task status:', id, 'to', newStatus);
        
        await dispatch(updateTask({ 
          id, 
          updates: { status: newStatus } 
        }) as any).unwrap();
        
        setNotification({ open: true, message: 'Статус задачи обновлен!', severity: 'success' });
        
        if (user) {
          dispatch(fetchTasks(user.id) as any);
        }
      }
    } catch (err: any) {
      console.error('Error updating task:', err);
      setNotification({ open: true, message: 'Ошибка при обновлении задачи', severity: 'error' });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Удалить задачу?')) {
      try {
        console.log('Deleting task:', id);
        await dispatch(deleteTask(id) as any).unwrap();
        setNotification({ open: true, message: 'Задача удалена!', severity: 'success' });
        
        if (user) {
          dispatch(fetchTasks(user.id) as any);
        }
      } catch (err: any) {
        console.error('Error deleting task:', err);
        setNotification({ open: true, message: 'Ошибка при удалении задачи', severity: 'error' });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (!user || !token) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
            {authMode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
            )}
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Менеджер задач
          </Typography>
          <Typography sx={{ mr: 2 }}>
            Привет, {user.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Мои задачи ({tasks.length})
          </Typography>
          <Button
            variant="contained"
            onClick={() => setTaskFormOpen(true)}
          >
            + Добавить задачу
          </Button>
        </Box>

        <TaskStats tasks={tasks} />

        {loading && tasks.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        )}

        <TaskForm
          open={taskFormOpen}
          onClose={() => setTaskFormOpen(false)}
          onSubmit={handleCreateTask}
          loading={loading}
        />

        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={handleCloseNotification}
        >
          <Alert 
            severity={notification.severity} 
            onClose={handleCloseNotification}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default App;