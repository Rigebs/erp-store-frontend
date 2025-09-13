import { CompanyRequest, CompanyResponse } from './company';
import { PersonRequest, PersonResponse } from './person';

export interface CustomerRequest {
  person?: PersonRequest;
  company?: CompanyRequest;
}

export interface CustomerResponse {
  id: number;
  enabled: boolean;
  person?: PersonResponse;
  company?: CompanyResponse;
}
