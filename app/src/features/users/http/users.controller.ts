import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ZodError } from 'zod';
import { fromZodError } from '../../../shared/http/zod-validation.exception';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import {
  createUserSchema,
  updateCurrentUserSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from '../schemas/users.schema';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { FindAllUsersUseCase } from '../use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from '../use-cases/find-user-by-id.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UpdateUserStatusUseCase } from '../use-cases/update-user-status.use-case';
import { UpdateUserPasswordUseCase } from '../use-cases/update-user-password.use-case';
import { UpdateCurrentUserUseCase } from '../use-cases/update-current-user.use-case';

type AuthenticatedRequest = Request & {
  user?: {
    sub?: string;
    role?: string;
  };
};

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('super_admin', 'admin_operacao')
export class UsersController {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
    private readonly updateUserPasswordUseCase: UpdateUserPasswordUseCase,
    private readonly updateCurrentUserUseCase: UpdateCurrentUserUseCase,
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
  create(@Body() body: unknown, @Req() request: AuthenticatedRequest) {
    try {
      const current = request.user as { role?: string } | undefined;
      const payload = createUserSchema.parse(body);

      if (
        payload.role &&
        payload.role !== 'partner' &&
        current?.role !== 'super_admin'
      ) {
        throw new ForbiddenException('Only super admins can create admins');
      }

      if (
        payload.status &&
        payload.status !== 'ACTIVE' &&
        current?.role !== 'super_admin'
      ) {
        throw new ForbiddenException('Only super admins can create inactive users');
      }

      return this.createUserUseCase.execute(payload);
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @Patch('me')
  updateMe(@Req() request: AuthenticatedRequest, @Body() body: unknown) {
    try {
      const user = request.user as { sub?: string; role?: string } | undefined;
      if (!user?.sub) throw new ForbiddenException('Missing session');
      return this.updateCurrentUserUseCase.execute(user.sub, updateCurrentUserSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown, @Req() request: AuthenticatedRequest) {
    try {
      const user = request.user as { sub?: string; role?: string } | undefined;
      if (!user?.sub) throw new ForbiddenException('Missing session');
      const payload = updateUserSchema.parse(body);
      if (user.role !== 'super_admin') {
        delete payload.role;
        delete payload.status;
      }
      return this.updateUserUseCase.execute(id, payload);
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: unknown, @Req() request: AuthenticatedRequest) {
    try {
      const user = request.user as { role?: string } | undefined;
      if (user?.role !== 'super_admin') {
        throw new ForbiddenException('Only super admins can change status');
      }
      return this.updateUserStatusUseCase.execute(id, body);
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @Patch(':id/password')
  updatePassword(@Param('id') id: string, @Body() body: unknown, @Req() request: AuthenticatedRequest) {
    try {
      const user = request.user as { sub?: string; role?: string } | undefined;
      if (!user?.sub) throw new ForbiddenException('Missing session');
      if (user.role !== 'super_admin' && user.sub !== id) {
        throw new ForbiddenException('Not allowed');
      }
      return this.updateUserPasswordUseCase.execute(id, updateUserPasswordSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }
}
