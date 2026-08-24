export type Role = 'DONOR' | 'NGO' | 'VOLUNTEER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
