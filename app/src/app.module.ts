import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './env';
import { PrismaModule } from './shared/prisma/prisma.module';
import { StorageModule } from './shared/storage/storage.module';
import { TripsModule } from './features/trips/trips.module';
import { ReservationsModule } from './features/reservations/reservations.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { MediaModule } from './features/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    PrismaModule,
    StorageModule,
    TripsModule,
    ReservationsModule,
    UsersModule,
    AuthModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
