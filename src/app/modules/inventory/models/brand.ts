export interface BrandResponse {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  flag: boolean;
}

export interface BrandRequest {
  name: string;
  description: string;
  userId: number;
}
