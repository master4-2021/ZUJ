import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public';

@Controller()
export class AppController {
  @Get('ping')
  @Public()
  async ping(): Promise<string> {
    return 'OK';
  }
}
