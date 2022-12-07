import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthPayload } from './types/auth-payload.interface';
import { AuthUser } from './types/auth-user.type';
import { JwtPayload } from './types/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await this.usersService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async logIn(user: AuthUser): Promise<AuthPayload> {
    const payload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}