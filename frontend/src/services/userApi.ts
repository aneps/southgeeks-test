import { User, CreateUserRequest, UpdateUserRequest, ApiError } from '../types/User';

const API_BASE_URL = 'http://localhost:8080';

class UserApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`);
    return this.handleResponse<User[]>(response);
  }

  async getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return this.handleResponse<User>(response);
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse<User>(response);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse<User>(response);
  }

  async deleteUser(id: number): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
    return this.handleResponse<{ message: string; user: User }>(response);
  }

  async searchUsersByZip(zipCode: string): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/search?zip=${encodeURIComponent(zipCode)}`);
    return this.handleResponse<User[]>(response);
  }
}

export const userApi = new UserApiService();
