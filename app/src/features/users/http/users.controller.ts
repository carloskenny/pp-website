import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ZodError } from 'zod';
import { fromZodError } from '../../../shared/http/zod-validation.exception';
import { createUserSchema } from '../schemas/users.schema';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '../use-cases/find-user-by-id.use-case';

@Controller('users')
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Get()
  findAll() {
    return this.findAllUsersUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findUserByIdUseCase.execute(id);
  }

  @Post()
  create(@Body() body: unknown) {
    try {
      return this.createUserUseCase.execute(createUserSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }
}
