import { Controller, Post, Body } from '@nestjs/common';
import { PasswordService, PasswordStrengthResult } from './password.service';

class CheckPasswordDto {
  password: string;
}

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Post('check-strength')
  checkStrength(@Body() checkPasswordDto: CheckPasswordDto): PasswordStrengthResult {
    return this.passwordService.checkPasswordStrength(checkPasswordDto.password);
  }
}