import { Uuid } from '@/common/types/common.type';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let userServiceValue: Partial<Record<keyof UserService, jest.Mock>>;

  beforeAll(async () => {
    userServiceValue = {
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userServiceValue,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // TODO: write unit tests for getCurrentUser method

  describe('createUser', () => {
    it('should return a user', async () => {
      const CreateUserDto = {
        username: 'john',
        email: 'mail@example.com',
        password: 'password',
        bio: 'bio',
      } as CreateUserDto;

      const userResDto = new UserDto();
      userResDto.id = '1';
      userResDto.username = 'john';
      userResDto.email = 'mail@example.com';
      userResDto.bio = 'bio';
      userResDto.createdAt = new Date();
      userResDto.updatedAt = new Date();

      userServiceValue.create.mockReturnValue(userResDto);
      const user = await controller.createUser(CreateUserDto);

      expect(user).toBe(userResDto);
      expect(userServiceValue.create).toHaveBeenCalledWith(CreateUserDto);
      expect(userServiceValue.create).toHaveBeenCalledTimes(1);
    });

    it('should return null', async () => {
      userServiceValue.create.mockReturnValue(null);
      const user = await controller.createUser({} as CreateUserDto);

      expect(user).toBeNull();
      expect(userServiceValue.create).toHaveBeenCalledWith({});
      expect(userServiceValue.create).toHaveBeenCalledTimes(1);
    });

    describe('CreateUserDto', () => {
      let createUserDto: CreateUserDto;

      beforeEach(() => {
        createUserDto = plainToInstance(CreateUserDto, {
          username: 'john',
          email: 'mail@example.com',
          password: 'password',
          bio: 'bio',
        });
      });

      it('should success with correctly data', async () => {
        const errors = await validate(CreateUserDto);
        expect(errors.length).toEqual(0);
      });

      it('should fail with empty username', async () => {
        createUserDto.username = '';
        const errors = await validate(CreateUserDto);
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({
          minLength: 'username must be longer than or equal to 1 characters',
        });
      });

      it('should fail with empty email', async () => {
        createUserDto.email = '';
        const errors = await validate(CreateUserDto);
        expect(errors.length).toEqual(1);
        expect(errors[0].property).toBe('email');
      });

      it('should fail with invalid email', async () => {
        createUserDto.email = 'invalid-email';
        const errors = await validate(CreateUserDto);
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({
          isEmail: 'email must be an email',
        });
      });

      it('should fail with empty password', async () => {
        createUserDto.password = '';
        const errors = await validate(CreateUserDto);
        expect(errors.length).toEqual(1);
        expect(errors[0].constraints).toEqual({
          minLength: 'password must be longer than or equal to 6 characters',
        });
      });

      it('should success with bio is null', async () => {
        createUserDto.bio = null;
        const errors = await validate(CreateUserDto);
        expect(errors.length).toEqual(0);
      });

      it('should success with bio is undefined', async () => {
        createUserDto.bio = undefined;
        const errors = await validate(CreateUserDto);
        expect(errors.length).toEqual(0);
      });
    });
  });

  describe('findUser', () => {
    it('should return a user', async () => {
      const userResDto = new UserDto();
      userResDto.id = '1';
      userResDto.username = 'john';
      userResDto.email = 'mail@example.com';
      userResDto.bio = 'bio';
      userResDto.createdAt = new Date();
      userResDto.updatedAt = new Date();

      userServiceValue.findOne.mockReturnValue(userResDto);
      const user = await controller.findUser('1' as Uuid);

      expect(user).toBe(userResDto);
      expect(userServiceValue.findOne).toHaveBeenCalledWith('1');
      expect(userServiceValue.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null', async () => {
      userServiceValue.findOne.mockReturnValue(null);
      const user = await controller.findUser('1' as Uuid);

      expect(user).toBeNull();
      expect(userServiceValue.findOne).toHaveBeenCalledWith('1');
      expect(userServiceValue.findOne).toHaveBeenCalledTimes(1);
    });
  });
});
