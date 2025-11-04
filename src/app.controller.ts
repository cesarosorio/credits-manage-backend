import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('readme')
  getApiDocumentation(): any {
    return this.appService.getApiDocumentation();
  }

  @Get('docs')
  @Header('Content-Type', 'text/html')
  getApiDocumentationHtml(): string {
    return this.appService.getApiDocumentationHtml();
  }
}
