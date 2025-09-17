import { PersonRequest, PersonResponse } from '../../customers/models/person';

export interface EmployeeRequest {
  hireDate: string;
  terminationDate?: string | null;
  jobTitle: string;
  salary: number;
  employmentStatus: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN';
  person: PersonRequest;
}

export interface EmployeeResponse {
  id: number;
  hireDate: string;
  terminationDate?: string | null;
  jobTitle: string;
  salary: number;
  employmentStatus: string;
  employmentType: string;
  person: PersonResponse;
}
