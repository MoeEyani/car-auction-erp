// src/roles/controllers/template-management.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  UsePipes
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BranchAccessGuard } from '../../common/guards/branch-access.guard';
import { TemplateManagerService } from '../services/template-manager.service';
import type { CreateTemplateDto, UpdateTemplateDto } from '../dto/template.zod';
import { createTemplateSchema, updateTemplateSchema } from '../dto/template.zod';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';

@Controller('roles/templates/manage')
@UseGuards(JwtAuthGuard, BranchAccessGuard)
export class TemplateManagementController {
  constructor(private readonly templateManager: TemplateManagerService) {}

  @Get()
  async getManageableTemplates(@Request() req: any) {
    return this.templateManager.getManageableTemplates(req.user.userId);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createTemplateSchema))
  async createTemplate(@Body() createTemplateDto: CreateTemplateDto, @Request() req: any) {
    return this.templateManager.createTemplate(createTemplateDto, req.user.userId);
  }

  @Put(':templateId')
  @UsePipes(new ZodValidationPipe(updateTemplateSchema))
  async updateTemplate(
    @Param('templateId') templateId: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @Request() req: any
  ) {
    return this.templateManager.updateTemplate(templateId, updateTemplateDto, req.user.userId);
  }

  @Delete(':templateId')
  async deleteTemplate(@Param('templateId') templateId: string, @Request() req: any) {
    return this.templateManager.deleteTemplate(templateId, req.user.userId);
  }
}