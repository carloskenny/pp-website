import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { USERS_REPOSITORY, UsersRepository } from '../../users/domain/users.repository';
import { LoginPayload } from '../schemas/auth.schema';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: LoginPayload) {
    const user = await this.usersRepository.findByEmail(payload.email);
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.passwordHash,
    );
    if (!isValidPassword) throw new UnauthorizedException('Invalid credentials');

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
