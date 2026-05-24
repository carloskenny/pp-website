import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { TripsRepository } from '../domain/trips.repository';
import { CreateTripInput, UpdateTripInput } from '../schemas/trips.schema';

@Injectable()
export class TripsPrismaRepository implements TripsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.trip.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findById(id: string) {
    return this.prisma.trip.findUnique({ where: { id } });
  }

  findBySlug(slug: string) {
    return this.prisma.trip.findUnique({ where: { slug } });
  }

  create(input: CreateTripInput) {
    return this.prisma.trip.create({ data: input });
  }

  update(id: string, input: UpdateTripInput) {
    return this.prisma.trip.update({ where: { id }, data: input });
  }

  delete(id: string) {
    return this.prisma.trip.delete({ where: { id } });
  }
}
