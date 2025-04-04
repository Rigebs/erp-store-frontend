export interface Pageable<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}
