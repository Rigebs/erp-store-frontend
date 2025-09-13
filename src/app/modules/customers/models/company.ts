export interface CompanyRequest {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CompanyResponse extends CompanyRequest {
  id: number;
}
