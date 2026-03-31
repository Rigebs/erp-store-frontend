export interface Person {
  id: number;
  name: string;
  paternalName: string;
  maternalName: string;
  email: string;
  phone: string;
  address: string;
}

export type EmploymentStatus = 'ACTIVE' | 'INACTIVE' | 'TERMINATED' | 'ON_LEAVE';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';

export interface Employee {
  id: number;
  hireDate: string;
  terminationDate?: string;
  jobTitle: string;
  salary: number;
  employmentStatus: EmploymentStatus;
  employmentType: EmploymentType;
  person: Person;
  user: User;
}

export interface User {
  id: number;
  email: string;
  username: string;
  expired: boolean;
  locked: boolean;
  enabled: boolean;
  role: string;
  employee: Employee;
  lastConnection?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
