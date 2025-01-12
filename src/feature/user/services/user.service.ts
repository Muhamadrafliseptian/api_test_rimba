import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { LogUserEntity } from '../entity/log_user';
const startTime = Date.now();

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LogUserEntity)
    private readonly logUserRepository: Repository<LogUserEntity>,
  ) { }

  async getAllUser(): Promise<any> {
    try {
      const dataUser = await this.userRepository.find();
      const duration = Date.now() - startTime;
      await this.logRequest('GET', '/api/user/all', HttpStatus.OK, duration);

      return { data: dataUser, statusCode: HttpStatus.OK, statusMessage: true };
    } catch (err) {
      const duration = Date.now() - startTime;
      await this.logRequest(
        'GET',
        '/api/user/all',
        HttpStatus.INTERNAL_SERVER_ERROR,
        duration,
      );

      return {
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusMessage: false,
      };
    }
  }

  async getAllLog(): Promise<any> {
    try {
      const dataUser = await this.logUserRepository.find();

      return { data: dataUser, statusCode: HttpStatus.OK, statusMessage: true };
    } catch (err) {
      return {
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusMessage: false,
      };
    }
  }

  async getDetailUser(idUser: string): Promise<any> {
    const duration = Date.now() - startTime;

    try {
      const detailUser = await this.userRepository.findOne({
        where: { id_users: idUser },
      });

      if (!detailUser) {
        await this.logRequest(
          'GET',
          `/api/user/${idUser}/show`,
          HttpStatus.NOT_FOUND,
          duration,
        );

        return {
          data: 'user not found',
          statusCode: HttpStatus.NOT_FOUND,
          statusMessage: true,
        };
      }

      await this.logRequest(
        'GET',
        `/api/user/${idUser}/show`,
        HttpStatus.OK,
        duration,
      );

      return {
        data: detailUser,
        statusCode: HttpStatus.OK,
        statusMessage: true,
      };
    } catch (err) {
      await this.logRequest(
        'GET',
        `/api/user/${idUser}/show`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        duration,
      );
      return {
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusMessage: false,
      };
    }
  }

  async createUser(params: any): Promise<any> {
    const startTime = Date.now();
    try {
      if (!params.name || typeof params.name !== 'string') {
        await this.logRequest(
          'POST',
          '/api/user/create',
          HttpStatus.BAD_REQUEST,
          Date.now() - startTime,
        );
        return {
          message: 'Nama harus diisi dengan format yang benar',
          statusCode: HttpStatus.BAD_REQUEST,
          statusMessage: false,
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!params.email || !emailRegex.test(params.email)) {
        await this.logRequest(
          'POST',
          '/api/user/create',
          HttpStatus.BAD_REQUEST,
          Date.now() - startTime,
        );
        return {
          message: 'Email harus diisi dengan format yang benar',
          statusCode: HttpStatus.BAD_REQUEST,
          statusMessage: false,
        };
      }

      if (!params.age || typeof params.age !== 'number' || params.age <= 0) {
        await this.logRequest(
          'POST',
          '/api/user/create',
          HttpStatus.BAD_REQUEST,
          Date.now() - startTime,
        );
        return {
          message: 'Usia harus diisi dengan angka yang benar',
          statusCode: HttpStatus.BAD_REQUEST,
          statusMessage: false,
        };
      }

      const findEmail = await this.userRepository.findOne({
        where: { email: params.email },
      });

      if (findEmail) {
        await this.logRequest(
          'POST',
          '/api/user/create',
          HttpStatus.BAD_REQUEST,
          Date.now() - startTime,
        );
        return {
          message: `email ${findEmail.email} sudah ada. gunakan email lain`,
          statusCode: HttpStatus.BAD_REQUEST,
          statusMessage: true,
        };
      }

      const postData = await this.userRepository.create({
        name: params.name,
        email: params.email,
        age: params.age,
      });

      await this.userRepository.save(postData);

      await this.logRequest(
        'POST',
        '/api/user/create',
        HttpStatus.CREATED,
        Date.now() - startTime,
      );
      return {
        message: 'berhasil tambah user',
        statusCode: HttpStatus.CREATED,
        statusMessage: true,
      };
    } catch (err) {
      await this.logRequest(
        'POST',
        '/api/user/create',
        HttpStatus.INTERNAL_SERVER_ERROR,
        Date.now() - startTime,
      );
      return {
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusMessage: false,
      };
    }
  }

  async destroyUser(idUser: string): Promise<any> {
    const startTime = Date.now();
    try {
      const detailUser = await this.userRepository.findOne({
        where: { id_users: idUser },
      });

      if (!detailUser) {
        await this.logRequest(
          'DELETE',
          `/api/user/${idUser}/destroy`,
          HttpStatus.NOT_FOUND,
          Date.now() - startTime,
        );
        return {
          data: 'user not found',
          statusCode: HttpStatus.NOT_FOUND,
          statusMessage: true,
        };
      }

      await this.userRepository.remove(detailUser);

      await this.logRequest(
        'DELETE',
        `/api/user/${idUser}/destroy`,
        HttpStatus.OK,
        Date.now() - startTime,
      );
      return {
        message: `user dengan id ${detailUser.id_users} berhasil dihapus`,
        statusCode: HttpStatus.OK,
        statusMessage: true,
      };
    } catch (err) {
      await this.logRequest(
        'DELETE',
        `/api/user/${idUser}/destroy`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        Date.now() - startTime,
      );
      return {
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusMessage: false,
      };
    }
  }

  async updateUser(params: any, id_user: any): Promise<any> {
    const startTime = Date.now();
    try {
      const user = await this.userRepository.findOne({
        where: { id_users: id_user },
      });

      console.log('====================================');
      console.log(user);
      console.log('====================================');

      if (!user) {
        await this.logRequest(
          'PUT',
          `/api/user/${id_user}/update`,
          HttpStatus.NOT_FOUND,
          Date.now() - startTime,
        );
        return {
          message: 'User tidak ditemukan',
          statusCode: HttpStatus.NOT_FOUND,
          statusMessage: false,
        };
      }

      if (params.name && typeof params.name !== 'string') {
        await this.logRequest(
          'PUT',
          `/api/user/${id_user}/update`,
          HttpStatus.BAD_REQUEST,
          Date.now() - startTime,
        );
        return {
          message: 'Nama harus diisi dengan format yang benar',
          statusCode: HttpStatus.BAD_REQUEST,
          statusMessage: false,
        };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (params.email && !emailRegex.test(params.email)) {
        await this.logRequest(
          'PUT',
          `/api/user/${id_user}/update`,
          HttpStatus.BAD_REQUEST,
          Date.now() - startTime,
        );
        return {
          message: 'Email harus diisi dengan format yang benar',
          statusCode: HttpStatus.BAD_REQUEST,
          statusMessage: false,
        };
      }

      if (params.age && (typeof params.age !== 'number' || params.age <= 0)) {
        await this.logRequest(
          'PUT',
          `/api/user/${id_user}/update`,
          HttpStatus.BAD_REQUEST,
          Date.now() - startTime,
        );
        return {
          message: 'Usia harus diisi dengan angka yang benar',
          statusCode: HttpStatus.BAD_REQUEST,
          statusMessage: false,
        };
      }

      Object.assign(user, params);
      await this.userRepository.save(user);

      await this.logRequest(
        'PUT',
        `/api/user/${id_user}/update`,
        HttpStatus.OK,
        Date.now() - startTime,
      );
      return {
        message: 'User berhasil diperbarui',
        statusCode: HttpStatus.OK,
        statusMessage: true,
      };
    } catch (err) {
      await this.logRequest(
        'PUT',
        `/api/user/${id_user}/update`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        Date.now() - startTime,
      );
      return {
        message: err.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        statusMessage: false,
      };
    }
  }

  private async logRequest(
    method: string,
    path: string,
    status: number,
    duration: any,
  ): Promise<void> {
    await this.logUserRepository.save({ method, path, status, duration });
  }
}
