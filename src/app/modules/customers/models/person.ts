export interface PersonRequest {
  name: string;
  paternalName: string;
  maternalName: string;
  email: string;
  phone: string;
  address: string;
}

export interface PersonResponse extends PersonRequest {
  id: number;
}
