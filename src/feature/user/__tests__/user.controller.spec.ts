import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controller/user.controller';
import { UserServices } from '../services/user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserServices;

  const mockUserService = {
    getAllUser: jest.fn().mockResolvedValue([{ id: 1, name: 'Rafli' }]),
    getDetailUser: jest.fn().mockResolvedValue({ id: 1, name: 'Rafli' }),
    createUser: jest.fn().mockResolvedValue({ message: 'User Created' }),
    updateUser: jest.fn().mockResolvedValue({ message: 'User Updated' }),
    destroyUser: jest.fn().mockResolvedValue({ message: 'User Deleted' }),
    getAllLog: jest.fn().mockResolvedValue([{ id: 1, method: 'GET' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserServices,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserServices>(UserServices);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('getAllUser', () => {
    it('return all users', async () => {
      const result = await userController.getAllUser();
      expect(result).toEqual([{ id: 1, name: 'Rafli' }]);
      expect(userService.getAllUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('create a user', async () => {
      const dto = { name: 'Rafli', email: 'rafli@yahoo.com', age: 22 };
      const result = await userController.createUser(dto);
      expect(result).toEqual({ message: 'User Created' });
      expect(userService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateUser', () => {
    it('update a user', async () => {
      const dto = { name: 'Rafli Updated' };
      const result = await userController.updateUser(dto, '1');
      expect(result).toEqual({ message: 'User Updated' });
      expect(userService.updateUser).toHaveBeenCalledWith(dto, '1');
    });
  });

  describe('destroyUser', () => {
    it('delete a user', async () => {
      const result = await userController.destroyUser('1');
      expect(result).toEqual({ message: 'User Deleted' });
      expect(userService.destroyUser).toHaveBeenCalledWith('1');
    });
  });

  describe('getDetailUser', () => {
    it('return a user detail', async () => {
      const result = await userController.getDetailUser('1');
      expect(result).toEqual({ id: 1, name: 'Rafli' });
      expect(userService.getDetailUser).toHaveBeenCalledWith('1');
    });
  });

  describe('getAllLog', () => {
    it('return all logs', async () => {
      const result = await userController.getAllLog();
      expect(result).toEqual([{ id: 1, method: 'GET' }]);
      expect(userService.getAllLog).toHaveBeenCalledTimes(1);
    });
  });
});
