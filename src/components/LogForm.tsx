import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '@/store/slices/authSlice';
import { RootState } from '@/store';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData) as any);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Вход
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Пароль"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? 'Вход...' : 'Войти'}
      </Button>
      <Button
        fullWidth
        variant="text"
        onClick={onSwitchToRegister}
      >
        Нет аккаунта? Зарегистрироваться
      </Button>
    </Box>
  );
};

export default LoginForm;