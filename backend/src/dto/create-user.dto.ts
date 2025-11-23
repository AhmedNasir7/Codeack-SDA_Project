export class CreateUserDto {
  name: string;
  username: string;
  email: string;
  password_hash: string;
  age?: number;
  auth_id?: number;
  portfolio_id?: number;
}

