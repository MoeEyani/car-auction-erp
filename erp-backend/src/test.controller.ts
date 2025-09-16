import { Controller, Get } from '@nestjs/common';

@Controller('api/test')
export class TestController {
  @Get()
  getTest(): object {
    return {
      message: 'مرحباً من الباك إند في Docker!',
      status: 'success',
      timestamp: new Date().toISOString(),
      container: 'erp_backend'
    };
  }

  @Get('arabic')
  getArabicTest(): object {
    return {
      رسالة: 'الباك إند يعمل بنجاح',
      الحالة: 'نجح',
      الوقت: new Date().toISOString(),
      المحتوى: 'كونتينر دوكر'
    };
  }
}