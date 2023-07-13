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
  UseGuards,
} from '@nestjs/common';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dtos/create-space.dto';
import AuthUser from 'src/common/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import { PageRequest } from 'src/common/page';
import { JoinSpaceDto } from './dtos/join-space.dto';
import { UpdateSpaceRoleTypeDto } from './dtos/update-space-role-type.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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

  @Delete('/:spaceId')
  @UseGuards(AuthGuard)
  async deleteSpace(
    @Res() res: Response,
    @Param('spaceId') spaceId: number,
    @AuthUser() user: User,
  ) {
    const result = await this.spacesService.deleteSpace(spaceId, user.id);
    return res.status(200).json(result);
  }

  @Post('/join')
  @UseGuards(AuthGuard)
  async joinSpace(
    @Res() res: Response,
    @Body() dto: JoinSpaceDto,
    @AuthUser() user: User,
  ) {
    const result = await this.spacesService.joinSpace(dto.joinCode, user.id);
    return res.status(201).json(result);
  }

  @Patch('/:spaceId/role/:roleId')
  @UseGuards(AuthGuard)
  async updateRoleType(
    @Res() res: Response,
    @Param('spaceId') spaceId: number,
    @Param('roleId') roleId: number,
    @Body() dto: UpdateSpaceRoleTypeDto,
    @AuthUser() user: User,
  ) {
    const result = await this.spacesService.updateRoleType(
      spaceId,
      roleId,
      dto,
      user.id,
    );
    return res.status(200).json(result);
  }

  @Delete('/:spaceId/role/:roleId')
  @UseGuards(AuthGuard)
  async deleteSpaceRole(
    @Res() res: Response,
    @Param('spaceId') spaceId: number,
    @Param('roleId') roleId: number,
    @AuthUser() user: User,
  ) {
    const result = await this.spacesService.deleteSpaceRole(
      spaceId,
      roleId,
      user.id,
    );
    return res.status(200).json(result);
  }

  @Patch(':spaceId/newOwner/:userId')
  @UseGuards(AuthGuard)
  async changeOwner(
    @Res() res: Response,
    @Param('spaceId') spaceId: number,
    @Param('userId') userId: number,
  ) {
    const result = await this.spacesService.changeOwner(spaceId, userId);
    return res.status(200).json(result);
  }
}
