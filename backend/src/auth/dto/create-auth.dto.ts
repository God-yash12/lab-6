import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../schemas/user.schema';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  department?: string;
}

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}