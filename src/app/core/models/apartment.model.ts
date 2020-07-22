import { User } from './user.model';

export type ApartmentStatus = 'available' | 'rendted';

export class Apartment {
  address: string;
  created: string;  // created datetime
  description: string;
  floorAreaSize: number;  // apartment size
  latitude: number;
  longitude: number;
  name: string;
  numberOfRooms: number;
  pricePerMonth: number;
  realtor: User[];
  status: ApartmentStatus;  // Available or Rented
  _id: string;
}
