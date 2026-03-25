export interface Company {
  id: number;
  taxId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  city: string;
  main: boolean;
  enabled: boolean;
  company: Company;
}

export interface CompanyPayload {
  taxId: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface BranchPayload {
  name: string;
  address: string;
  phone: string;
  city: string;
  main: boolean;
  company: CompanyPayload; // Objeto anidado
}
