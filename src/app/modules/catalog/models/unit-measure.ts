export interface UnitMeasureResponse {
  id: number;
  name: string;
  abbreviation: string;
  description: string;
  enabled: boolean;
  flag: boolean;
}

export interface UnitMeasureRequest {
  name: string;
  abbreviation: string;
  description: string;
  userId: number;
}
