import { Body, Controller, Post } from '@nestjs/common';
import { ZodError } from 'zod';
import { fromZodError } from '../../../shared/http/zod-validation.exception';
import { loginSchema } from '../schemas/auth.schema';
import { LoginUseCase } from '../use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  login(@Body() body: unknown) {
    try {
      return this.loginUseCase.execute(loginSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }
}
