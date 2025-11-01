import { Task, CreateTaskDto, User, LoginCredentials, RegisterData, AuthResponse } from '@/types/task';

const API_BASE_URL = 'https://gorest.co.in/public/v2';
const API_TOKEN = '1f854354cc8d7982c489e1e9642b1e1d11a86934553bb0b37eb344c0540f416e';

let currentUser: User | null = null;

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('Login attempt for:', credentials.email);
      
      const response = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(credentials.email)}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check user');
      }

      const users = await response.json();
      console.log('Found users:', users);
      
      let user: User;
      if (users.length === 0) {

        console.log('Creating new user...');
        const newUser: RegisterData = {
          name: credentials.email.split('@')[0] || 'User',
          email: credentials.email,
          gender: 'male',
          status: 'active'
        };

        const registerResponse = await fetch(`${API_BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`
          },
          body: JSON.stringify(newUser)
        });

        if (!registerResponse.ok) {
          const error = await registerResponse.text();
          console.error('Registration error:', error);
          throw new Error(`Registration failed: ${error}`);
        }

        user = await registerResponse.json();
        console.log('New user created:', user);
      } else {

        user = users[0];
        console.log('Using existing user:', user);
      }

      currentUser = user;

      return {
        data: {
          user,
          token: API_TOKEN
        }
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error('Login failed: ' + error.message);
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('Registering user:', userData);

      const checkResponse = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(userData.email)}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      if (!checkResponse.ok) {
        throw new Error('Failed to check email availability');
      }

      const existingUsers = await checkResponse.json();
      if (existingUsers.length > 0) {
        throw new Error('User with this email already exists');
      }

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Registration failed:', errorText);
        throw new Error(`Registration failed: ${response.status} - ${errorText}`);
      }

      const user = await response.json();
      console.log('User registered successfully:', user);
      
      currentUser = user;

      return {
        data: {
          user,
          token: API_TOKEN
        }
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  }
};

export const tasksApi = {
  getTasks: async (userId: string): Promise<Task[]> => {
    try {
      console.log('Fetching tasks for user:', userId);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/todos`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      console.log('Tasks response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('No tasks found, returning empty array');
          return [];
        }
        const errorText = await response.text();
        console.error('Tasks fetch error:', errorText);
        throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`);
      }

      const tasks = await response.json();
      console.log('Fetched tasks:', tasks);
      return tasks;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks: ' + error.message);
    }
  },

  createTask: async (taskData: CreateTaskDto): Promise<Task> => {
    try {
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      console.log('Creating task for user:', currentUser.id, 'Data:', taskData);

      const taskPayload = {
        ...taskData,
        user_id: currentUser.id
      };

      console.log('Task payload:', taskPayload);

      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(taskPayload)
      });

      console.log('Create task response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create task error:', errorText);
        throw new Error(`Failed to create task: ${response.status} - ${errorText}`);
      }

      const task = await response.json();
      console.log('Task created successfully:', task);
      return task;
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task: ' + error.message);
    }
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    try {
      console.log('Updating task:', id, 'Updates:', updates);

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify(updates)
      });

      console.log('Update task response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update task error:', errorText);
        throw new Error(`Failed to update task: ${response.status} - ${errorText}`);
      }

      const task = await response.json();
      console.log('Task updated successfully:', task);
      return task;
    } catch (error: any) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task: ' + error.message);
    }
  },

  deleteTask: async (id: string): Promise<void> => {
    try {
      console.log('Deleting task:', id);

      const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });

      console.log('Delete task response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete task error:', errorText);
        throw new Error(`Failed to delete task: ${response.status} - ${errorText}`);
      }

      console.log('Task deleted successfully');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task: ' + error.message);
    }
  }
};