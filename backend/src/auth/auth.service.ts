import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from './dto/create-auth.dto';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, email, password, role, department } = registerDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Check password strength
    const passwordStrength = this.passwordService.checkPasswordStrength(password);
    
    if (passwordStrength.score < 40) {
      throw new UnauthorizedException('Password is too weak. Please choose a stronger password.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with RBAC attributes
    const user = new this.userModel({
      username,
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
      department,
      passwordStrength: passwordStrength.score,
      permissions: this.getDefaultPermissions(role || UserRole.USER),
    });

    await user.save();

    const token = this.jwtService.sign({ 
      userId: user._id, 
      username: user.username,
      role: user.role,
      permissions: user.permissions 
    });

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: user.permissions,
      },
      token,
      passwordStrength,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.userModel.findOne({ username });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = this.jwtService.sign({ 
      userId: user._id, 
      username: user.username,
      role: user.role,
      permissions: user.permissions 
    });

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        permissions: user.permissions,
        lastLogin: user.lastLogin,
      },
      token,
    };
  }

  private getDefaultPermissions(role: UserRole): string[] {
    const permissions = {
      [UserRole.ADMIN]: [
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'system:manage',
        'reports:view',
      ],
      [UserRole.MANAGER]: [
        'user:read',
        'user:update',
        'reports:view',
        'team:manage',
      ],
      [UserRole.USER]: [
        'profile:read',
        'profile:update',
      ],
    };

    return permissions[role] || permissions[UserRole.USER];
  }
}