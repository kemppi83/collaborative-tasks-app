export interface User {
  username: string;
  email: string;
}

export interface UserResponse {
  user: User;
  token: string;
}

export interface SignupRequest {
  username?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  status: string;
  collaborators: string[];
  tasks: string[];
  owner: boolean;
}

export interface GetTodosResponse {
  todos: Todo[];
}

export interface CreateTodoResponse {
  message: string;
  createdTodo: Todo;
}

export interface UpdateTodoRequest {
  id: string;
  status: string;
}

export interface UpdateTodoResponse {
  message: string;
  updatedTodo: Todo;
}

export interface DeleteTodoResponse {
  message: string;
}

export interface Message {
  id: string;
  userName: string;
  text: string;
}
