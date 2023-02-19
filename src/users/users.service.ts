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

  async findOneByNameOrEmail(identifier: string) {
    const user = await this.usersRepository.findOne({where: [
      {email: identifier},
      {name: identifier},
    ]})
    if(user) {
      return true;
    }
    
    // throw new HttpException('User not found', HttpStatus.NOT_FOUND)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //check if user exists first
    const userExists = await this.usersRepository.findOneBy({id})
    if(!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    //check if email is already a registered one
    const anotherUserEmailAlreadyExists = await this.usersRepository.findOneBy({email: updateUserDto.email})
    if(anotherUserEmailAlreadyExists === null) {
      console.log(updateUserDto)
      throw new HttpException('Email is already registered', HttpStatus.BAD_REQUEST)
    }

  // if all checks pass, update the user.
    const updatedUser = await this.usersRepository.update(id, updateUserDto)
    if(!updatedUser.affected){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }

    return await this.usersRepository.findOneBy({id})
  }

  async remove(id: string) {
    const deletedUser = await this.usersRepository.delete(id);
    if(!deletedUser.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
  }
}
