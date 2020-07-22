import { UserData } from './auth.model';

export class ApiResponse<T> {
  success: number;
  data: T;
}
