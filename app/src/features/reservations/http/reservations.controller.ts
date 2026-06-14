import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { fromZodError } from '../../../shared/http/zod-validation.exception';
import {
  createReservationSchema,
  updateReservationStatusSchema,
} from '../schemas/reservations.schema';
import { CreateReservationUseCase } from '../use-cases/create-reservation.use-case';
import { FindAllReservationsUseCase } from '../use-cases/find-all-reservations.use-case';
import { FindReservationByIdUseCase } from '../use-cases/find-reservation-by-id.use-case';
import { UpdateReservationStatusUseCase } from '../use-cases/update-reservation-status.use-case';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly findAllReservationsUseCase: FindAllReservationsUseCase,
    private readonly findReservationByIdUseCase: FindReservationByIdUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly updateReservationStatusUseCase: UpdateReservationStatusUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao', 'atendimento')
  findAll() {
    return this.findAllReservationsUseCase.execute();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao', 'atendimento')
  findOne(@Param('id') id: string) {
    return this.findReservationByIdUseCase.execute(id);
  }

  @Post()
  create(@Body() body: unknown) {
    try {
      return this.createReservationUseCase.execute(
        createReservationSchema.parse(body),
      );
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao', 'atendimento')
  updateStatus(@Param('id') id: string, @Body() body: unknown) {
    try {
      return this.updateReservationStatusUseCase.execute(
        id,
        updateReservationStatusSchema.parse(body),
      );
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }
}
