import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}

  async create(user: CreateUserDto) {
    if(!user.email || !user.name || !user.password) {
      throw new HttpException('Fields cannot be empty', HttpStatus.BAD_REQUEST)
    }

    if(await this.usersRepository.findOneBy({email: user.email})) {
      throw new HttpException('A user with that email already exists', HttpStatus.BAD_REQUEST)
    }

    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser)
    return newUser
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({where: {id}})
    if(user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND)
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({where: {email} })
    if(user) {
      return user;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.usersRepository.findOneBy({id})
    if(!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const anotherUserEmailAlreadyExists = await this.usersRepository.findOneBy({email: updateUserDto.email})
    if(anotherUserEmailAlreadyExists) {
      if(anotherUserEmailAlreadyExists.email !== userExists.email)
        throw new HttpException('Wrong email for current user', HttpStatus.BAD_REQUEST)
    }


  const updatedUser = await this.usersRepository.update(id, updateUserDto)
    if(!updatedUser.affected){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    const response = await this.usersRepository.findOneBy({id})
    return response
  }


  async updateToken(id: string, updateUserDto: UpdateUserDto) {
    const userExists = await this.usersRepository.findOneBy({id})
    if(!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    await this.usersRepository.update(id, updateUserDto)
    const searchUpdatedUser = await this.usersRepository.findOneBy({id})
    return searchUpdatedUser
  }

  async remove(id: string) {
    const deletedUser = await this.usersRepository.delete(id);
    if(!deletedUser.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }
}
