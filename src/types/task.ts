export interface User {
  id: string;
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active' | 'inactive';
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  due_on: string;
  status: 'pending' | 'completed';
}

export interface CreateTaskDto {
  title: string;
  description: string;
  due_on: string;
  status: 'pending' | 'completed';
}

export interface AuthResponse {
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  gender: 'male' | 'female';
  status: 'active';
}