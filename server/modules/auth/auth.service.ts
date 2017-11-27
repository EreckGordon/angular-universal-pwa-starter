import { Component, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

const util = require('util');
import * as fs from "fs";
import * as path from 'path';
const crypto = require('crypto');
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import * as passwordValidator from 'password-validator';


const randomBytes = util.promisify(crypto.randomBytes);
const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(process.cwd(), 'private.key'))
const RSA_PUBLIC_KEY = fs.readFileSync(path.join(process.cwd(), 'public.key'))

interface SessionAndCSRFToken {
  sessionToken: string,
  csrfToken: string
}

@Component()
export class AuthService {
  constructor(@Inject('UserRepositoryToken') private readonly userRepository: Repository<User>) {}

  get publicRSAKey(){
    return RSA_PUBLIC_KEY;
  }

  async findUserByEmail(email:string): Promise<User> {
    return await this.userRepository.findOne({email})
  }

  async emailTaken(email:string): Promise<boolean> {
    return await this.findUserByEmail(email) === undefined ? false : true;
  }  

  async addUserToDatabase(email:string, passwordHash:string): Promise<User> {
  	const user = new User();
  	user.email = email;
  	user.passwordHash = passwordHash;
  	user.roles = ['user'];
  	return await this.userRepository.save(user)
  }

  async createUserAndSession(credentials) {
    try {
      const passwordHash = await argon2.hash(credentials.password);
      const user = await this.addUserToDatabase(credentials.email, passwordHash);
      const sessionToken = await this.createSessionToken(user);
      const csrfToken = await this.createCsrfToken();
      const result = {user, sessionToken, csrfToken};
      return result;
    }
    catch(err){
      return err
    }
  }  

  async loginAndCreateSession(credentials:any, user:User): Promise<SessionAndCSRFToken> {
      try {
          const sessionToken = await this.attemptLogin(credentials, user);
          const csrfToken = await this.createCsrfToken();
          const result:SessionAndCSRFToken = {sessionToken, csrfToken}
          return result
      }      
      catch(err) {
        return err
      }
  }

  async attemptLogin(credentials:any, user:User) {
      const isPasswordValid = await argon2.verify(user.passwordHash, credentials.password);
      if (!isPasswordValid) {
          throw new Error("Password Invalid");
      }
      return this.createSessionToken(user);
  }

  async createCsrfToken() {
      return await randomBytes(32).then(bytes => bytes.toString("hex"));
  }

  async createSessionToken(user: User) {
      return await signJwt({
              roles: user.roles
          },
          RSA_PRIVATE_KEY, {
          algorithm: 'RS256',
          expiresIn: 7200,
          subject: user.id.toString()
      });
  }

  async decodeJwt(token:string) {
      const payload = await jwt.verify(token, RSA_PUBLIC_KEY);
      return payload;
  }

  validatePassword(password:string) {
    const schema = new passwordValidator();
    schema
      .is().min(10)
      .is().not().oneOf(['Passw0rd', 'Password123']);
    return schema.validate(password, {list:true});
  }    

}