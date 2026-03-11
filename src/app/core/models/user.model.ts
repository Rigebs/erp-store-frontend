export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'MANAGER';
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
