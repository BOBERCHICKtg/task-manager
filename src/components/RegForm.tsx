import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '@/store/slices/authSlice';
import { RootState } from '@/store';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: 'male' as 'male' | 'female',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const registerData = {
      ...formData,
      status: 'active' as const
    };
    dispatch(register(registerData) as any);
  };

  const handleChange = (e: any) => {
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
        Регистрация
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Имя"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
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
      <FormControl fullWidth margin="normal">
        <InputLabel>Пол</InputLabel>
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          label="Пол"
        >
          <MenuItem value="male">Мужской</MenuItem>
          <MenuItem value="female">Женский</MenuItem>
        </Select>
      </FormControl>
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
        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>
      <Button
        fullWidth
        variant="text"
        onClick={onSwitchToLogin}
      >
        Уже есть аккаунт? Войти
      </Button>
    </Box>
  );
};

export default RegisterForm;