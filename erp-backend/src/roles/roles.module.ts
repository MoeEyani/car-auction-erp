import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TemplateManagerService } from './services/template-manager.service';
import { TemplateManagementController } from './controllers/template-management.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RolesController, TemplateManagementController],
  providers: [RolesService, TemplateManagerService],
  exports: [RolesService, TemplateManagerService],
})
export class RolesModule {}
