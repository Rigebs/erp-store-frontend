export interface SupplierResponse {
  id: number;
  name: string;
  contactName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  website: string;
  enabled: boolean;
  flag: boolean;
}

export interface SupplierRequest {
  id: number;
  name: string;
  contactName: string;
  contactEmail: string;
  phoneNumber: string;
  address: string;
  website: string;
  enabled: boolean;
}
