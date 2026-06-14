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
      include: {
        trip: {
          select: {
            id: true,
            slug: true,
            title: true,
            destination: true,
            dateLabel: true,
          },
        },
        trilheiro: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        boardingPoint: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }

  findById(id: string) {
    return this.prisma.reservation.findUnique({
      where: { id },
      include: {
        trip: {
          select: {
            id: true,
            slug: true,
            title: true,
            destination: true,
            dateLabel: true,
          },
        },
        trilheiro: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        boardingPoint: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }

  create(input: CreateReservationInput) {
    return this.prisma.reservation.create({
      data: input,
      include: {
        trip: {
          select: {
            id: true,
            slug: true,
            title: true,
            destination: true,
            dateLabel: true,
          },
        },
        trilheiro: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        boardingPoint: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }

  updateStatus(id: string, input: UpdateReservationStatusInput) {
    return this.prisma.reservation.update({
      where: { id },
      data: { status: input.status },
      include: {
        trip: {
          select: {
            id: true,
            slug: true,
            title: true,
            destination: true,
            dateLabel: true,
          },
        },
        trilheiro: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        boardingPoint: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });
  }
}
