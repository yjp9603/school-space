import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import UseAuthGuards from '../auth/auth-guards/user-auth';
import { Response } from 'express';
import { PageRequest } from 'src/common/page';
import { JoinSpaceDto } from './dto/join-space.dto';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @UseAuthGuards()
  async createSpace(
    @Res() res: Response,
    @Body() createSpaceDto: CreateSpaceDto,
    @AuthUser() user: User,
  ) {
    const result = await this.spacesService.createSpace(
      createSpaceDto,
      user.id,
    );
    return res.status(201).json(result);
  }

  @Get()
  @UseAuthGuards()
  async findAllSpaceList(
    @Res() res: Response,
    @AuthUser() user: User,
    @Query() pageRequest: PageRequest,
  ) {
    const result = await this.spacesService.findAllSpaceList(
      user.id,
      pageRequest,
    );
    return res.status(200).json(result);
  }

  @Delete('/:id')
  @UseAuthGuards()
  async deleteSpace(
    @Res() res: Response,
    @Param('id') spaceId: number,
    @AuthUser() user: User,
  ) {
    const result = await this.spacesService.deleteSpace(spaceId, user.id);
    return res.status(200).json(result);
  }

  @Post('/join')
  @UseAuthGuards()
  async joinSpace(
    @Res() res: Response,
    @Body() dto: JoinSpaceDto,
    @AuthUser() user: User,
  ) {
    const result = await this.spacesService.joinSpace(dto.joinCode, user.id);
    return res.status(200).json(result);
  }
}
