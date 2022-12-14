import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthUser } from './types/auth-user.type';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayload } from './types/auth-payload.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @UseGuards(LocalAuthGuard)
  logIn(@Req() req: { user: AuthUser }): Promise<AuthPayload> {
    return this.authService.logIn(req.user);
  }

  @Post('register')
  register(@Body() registerCredetialsDto: CreateUserDto): Promise<AuthPayload> {
    return this.authService.register(registerCredetialsDto);
  }

  @Get('login/federated/google')
  @UseGuards(AuthGuard('google'))
  loginGoogle(@Res() res: Response) {
    return res.status(HttpStatus.OK).send();
  }

  @Get('oauth2/google/redirect')
  @UseGuards(AuthGuard('google'))
  loginGoogleRedirect(@Req() req: { user: Express.User }) {
    return req.user;
    // return this.authService.handleLoginWithGoogle(req.user);
  }
}
