import { Request, Response, NextFunction } from "express";
const util = require('util');
import * as argon2 from 'argon2';

import { Auth } from './auth';
import { DatabaseConnection } from './database-connection';

const db = new DatabaseConnection();
const auth = new Auth()

export class API {

  async login(req: Request, res: Response) {

      const credentials = req.body;

      const user = await db.findUserByEmail(credentials.email);

      if (!user) {
          res.sendStatus(403);
      }

      else {
          auth.loginAndCreateSession(credentials, user, res);
      }

  }

  logout(req: Request, res: Response) {

      res.clearCookie("SESSIONID");

      res.clearCookie("XSRF-TOKEN");

      res.sendStatus(200);
  }  

  async createUser(req: Request, res:Response) {

      const credentials = req.body;

      const usernameTaken = await !!db.findUserByEmail(credentials.email)

      if (usernameTaken) res.sendStatus(409).json({error: 'email already in use'});

      const passwordErrors = auth.validatePassword(credentials.password);

      if (passwordErrors.length > 0) {
          res.status(400).json({passwordErrors});
      }

      else {

          this.createUserAndSession(res, credentials)
              .catch((err) => {
              console.log("Error creating new user", err);
              res.sendStatus(500);
          });

      }

  }

  private async checkIfUserExists(email:string) {
    return await !!db.findUserByEmail(email);
  }

  private async createUserAndSession(res:Response, credentials) {

      const passwordHash = await argon2.hash(credentials.password);

      const user = await db.createUser(credentials.email, passwordHash);

      const sessionToken = await auth.createSessionToken(user);

      const csrfToken = await auth.createCsrfToken();

      res.cookie("SESSIONID", sessionToken, {httpOnly:true, secure:true});

      res.cookie("XSRF-TOKEN", csrfToken);

      res.status(200).json({id:user.id, email:user.email, roles: user.roles});
  }

}
