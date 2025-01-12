import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserServices } from '../services/user.service';

@ApiTags('User Management')
@Controller('api/user')
export class UserController {
  constructor(private readonly userservice: UserServices) {}

  @Get('all')
  @ApiOperation({ summary: 'Get all users' })
  async getAllUser(): Promise<any> {
    return this.userservice.getAllUser();
  }

  @Get('log/request')
  @ApiOperation({ summary: 'Get all request logs' })
  async getAllLog(): Promise<any> {
    return this.userservice.getAllLog();
  }

  @Get(':id_user/show')
  @ApiOperation({ summary: 'Get detail of a user by ID' })
  async getDetailUser(@Param('id_user') id_user: string): Promise<any> {
    return this.userservice.getDetailUser(id_user);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        age: { type: 'number' },
      },
    },
  })
  async createUser(@Body() params: any): Promise<any> {
    return this.userservice.createUser(params);
  }

  @Put(':id_user/update')
  @ApiOperation({ summary: 'Update user data' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        age: { type: 'number' },
      },
    },
  })
  async updateUser(
    @Body() params: string,
    @Param('id_user') id_user: string,
  ): Promise<any> {
    return this.userservice.updateUser(params, id_user);
  }

  @Delete(':id_user/destroy')
  @ApiOperation({ summary: 'Delete a user by ID' })
  async destroyUser(@Param('id_user') id_user: string): Promise<any> {
    return this.userservice.destroyUser(id_user);
  }
}
