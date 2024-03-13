export interface Response<T> {
  code?: number;
  data: T;
  message?: string;
}

export interface ResponseList<T> {
  page: number;
  size: number;
  total: number;
  records: T[];
}
