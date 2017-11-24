import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Component()
export class AuthService {
  constructor(@Inject('UserRepositoryToken') private readonly userRepository: Repository<User>) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserByEmail(email:string){
    return await this.userRepository.findOne({email})
  }

  async findUserById(id:string){
    return await this.userRepository.findOne(id)
  }

  async createUser(email:string, passwordHash:string){
	const user = new User();
	user.email = email;
	user.passwordHash = passwordHash;
	user.roles = ['user'];
	return await this.userRepository.save(user)
  }

}