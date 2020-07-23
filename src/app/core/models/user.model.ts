import { BaseEntity } from './base-entity.model';

export type UserRole = 'client' | 'realtor' | 'admin';

export class User extends BaseEntity {
  email: string;
  firstname: string;
  lastname: string;
  role: UserRole;
  verified: boolean;
}
