export interface LineResponse {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  flag: boolean;
}

export interface LineRequest {
  name: string;
  description: string;
  userId: number;
}
