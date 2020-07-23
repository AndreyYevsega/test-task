import { User } from './user.model';
import { BaseEntity } from './base-entity.model';

export type ApartmentStatus = 'Available' | 'Rented';

export class Apartment extends BaseEntity {
  address: string;
  created: string;  // created datetime
  description: string;
  floorAreaSize: number;  // apartment size
  latitude: number;
  longitude: number;
  name: string;
  numberOfRooms: number;
  pricePerMonth: number;
  realtor: User;
  status: ApartmentStatus;  // Available or Rented
}
