export type UserRole = 'client' | 'realtor' | 'admin';

export class User {
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  verified: boolean;
}
