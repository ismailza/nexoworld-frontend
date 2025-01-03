export interface AppResponse<T> {
  success: boolean;
  result?: T | any;
  message?: string;
}