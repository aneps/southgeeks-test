export interface User {
  id: number;
  name: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export interface CreateUserRequest {
  name: string;
  zipCode: string;
}

export interface UpdateUserRequest {
  name?: string;
  zipCode?: string;
}

export interface ApiError {
  error: string;
}
