import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello guys welcome to my first of back-end project!';
  }
}
