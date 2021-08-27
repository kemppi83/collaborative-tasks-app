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

export interface RecoveryRequest {
  email: string;
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
  collaboratorString?: string;
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

export interface ServiceResponse {
  message: string;
}

export interface Message {
  id: string;
  userName: string;
  text: string;
}

export interface Task {
  id: string;
  parent_todo: string;
  parent_task?: string;
  title: string;
  timestamp: number;
  status: string;
  children: string[];
}
