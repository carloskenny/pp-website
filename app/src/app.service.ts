import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class AppService {
  health() {
    return {
      status: 'ok',
      service: 'pp-backend',
      timestamp: dayjs().toISOString(),
    };
  }
}
