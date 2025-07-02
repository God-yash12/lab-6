import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PasswordModule } from './password/password.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL || 'mongodb+srv://cyber_security:NB40NGm5O3PnVbuJ@cluster0.qpysymj.mongodb.net/users_cybersecurity?retryWrites=true&w=majority&appName=Cluster0', {}),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '24h' },
    }),
    PasswordModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}