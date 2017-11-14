import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { User } from './db/entity/User';
import * as argon2 from 'argon2';

export class DatabaseConnection {
  public ready: boolean = false;
  public connection: Connection;

  constructor()  {
    createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'testingpass',
        database: 'testingDB',
        entities: [
            User
        ],
        synchronize: true,
        logging: false
    }).then(async connection => {
        console.log("DONE connecting!");
        this.connection = await connection;
        this.ready = true;
        const pwHash = await argon2.hash('greatestPass')
        await this.createUser('ereckgordon@gmail.com', pwHash)

        const usernameTaken = await this.findUserByEmail('ereckgordon@gmail.com') === undefined ? false : true
        console.log('usernameTaken', usernameTaken)
        const untakenUsername = await this.findUserByEmail('asdf@email.com') === undefined ? false : true
        console.log('untakenUsername', untakenUsername)

        const allUsers = await connection.manager.find(User);
        console.log(allUsers)
    
    }).catch(error => console.log(error));
  }

  async findUserByEmail(email:string){
      return await this.connection.manager.findOne(User, {email})
  }

  async findUserById(id:string){
      return await this.connection.manager.findOneById(User, id)
  }

  async createUser(email:string, passwordHash:string){
      const user = new User();
      user.email = email;
      user.passwordHash = passwordHash;
      user.roles = ['user']
      return await this.connection.manager.save(user)
  }

}