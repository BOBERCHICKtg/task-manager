import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, dueDate: string, status: string) => void;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, onSubmit, loading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('pending');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // Если дата не указана, используем текущую дату + 7 дней
      const finalDueDate = dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      onSubmit(title, description, finalDueDate, status);
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('pending');
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('pending');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Добавить задачу</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Название задачи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              label="Дата выполнения"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Статус"
              >
                <MenuItem value="pending">В процессе</MenuItem>
                <MenuItem value="completed">Выполнено</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={loading || !title.trim()}>
            {loading ? 'Сохранение...' : 'Добавить'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskForm;