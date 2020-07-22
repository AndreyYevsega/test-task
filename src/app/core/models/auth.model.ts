import { User } from './user.model';

export class SignInInput {
  email: string;
  password: string;
  constructor({ email, password, }: SignInInput) {
    this.email = email;
    this.password = password;
  }
}
export class UserData {
  token: string;
  user: User;
}

export class AuthResponse {
  success: number;
  data: UserData;
}

export class SignUpInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  constructor({ email, password, firstName, lastName }: SignUpInput) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
