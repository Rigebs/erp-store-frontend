export interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  flag: boolean;
}

export interface CategoryRequest {
  name: string;
  description: string;
  userId: number;
}
