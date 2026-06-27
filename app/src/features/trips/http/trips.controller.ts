import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { fromZodError } from '../../../shared/http/zod-validation.exception';
import { createTripSchema, updateTripSchema } from '../schemas/trips.schema';
import { CreateTripUseCase } from '../use-cases/create-trip.use-case';
import { DeleteTripUseCase } from '../use-cases/delete-trip.use-case';
import { FindAllTripsUseCase } from '../use-cases/find-all-trips.use-case';
import { FindTripByIdUseCase } from '../use-cases/find-trip-by-id.use-case';
import { FindTripBySlugUseCase } from '../use-cases/find-trip-by-slug.use-case';
import { UpdateTripUseCase } from '../use-cases/update-trip.use-case';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('trips')
export class TripsController {
  constructor(
    private readonly findAllTripsUseCase: FindAllTripsUseCase,
    private readonly findTripByIdUseCase: FindTripByIdUseCase,
    private readonly findTripBySlugUseCase: FindTripBySlugUseCase,
    private readonly createTripUseCase: CreateTripUseCase,
    private readonly updateTripUseCase: UpdateTripUseCase,
    private readonly deleteTripUseCase: DeleteTripUseCase,
  ) {}

  @Get()
  findAll() {
    return this.findAllTripsUseCase.execute({ publishedOnly: true });
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao')
  findAllAdmin() {
    return this.findAllTripsUseCase.execute();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.findTripBySlugUseCase.execute(slug, { publishedOnly: true });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao')
  findOne(@Param('id') id: string) {
    return this.findTripByIdUseCase.execute(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao')
  @Post()
  create(@Body() body: unknown) {
    try {
      return this.createTripUseCase.execute(createTripSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao')
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    try {
      return this.updateTripUseCase.execute(id, updateTripSchema.parse(body));
    } catch (error) {
      if (error instanceof ZodError) throw fromZodError(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin', 'admin_operacao')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteTripUseCase.execute(id);
  }
}
