import { Request, Response, NextFunction } from "express";
const util = require('util');
import * as fs from "fs";
const crypto = require('crypto');
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import * as passwordValidator from 'password-validator';

import { User } from './db/entity/User';

const randomBytes = util.promisify(crypto.randomBytes);
const signJwt = util.promisify(jwt.sign);

const RSA_PRIVATE_KEY = fs.readFileSync('./private.key');
const RSA_PUBLIC_KEY = fs.readFileSync('./public.key');
const SESSION_DURATION = 1000;


export class Auth {

  async loginAndCreateSession(credentials:any, user:User,  res: Response) {

      try {

          const sessionToken = await this.attemptLogin(credentials, user);

          const csrfToken = await this.createCsrfToken();

          console.log("Login successful");

          res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});

          res.cookie("XSRF-TOKEN", csrfToken);

          res.status(200).json({id:user.id, email:user.email, roles: user.roles});

      }
      
      catch(err) {

          console.log("Login failed:", err);
          res.sendStatus(403);

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
      return signJwt({
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

    return schema.validate(password, {list:true})

  }  

}