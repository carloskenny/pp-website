import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { ReservationsRepository } from '../domain/reservations.repository';
import {
  CreateReservationInput,
  UpdateReservationStatusInput,
} from '../schemas/reservations.schema';

@Injectable()
export class ReservationsPrismaRepository implements ReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string) {
    return this.prisma.reservation.findUnique({ where: { id } });
  }

  create(input: CreateReservationInput) {
    return this.prisma.reservation.create({ data: input });
  }

  updateStatus(id: string, input: UpdateReservationStatusInput) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status: input.status },
    });
  }
}
