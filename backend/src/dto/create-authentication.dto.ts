export class CreateAuthenticationDto {
  username: string;
  hashed_password: string;
  email: string;
  is_active?: boolean;
}

