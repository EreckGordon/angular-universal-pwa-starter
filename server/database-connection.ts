import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
import { User } from './db/entity/User';

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

        const user = new User();
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.age = 25;
        await connection.manager.save(user)
        const allUsers = await connection.manager.find(User);
        console.log(allUsers)
    
    }).catch(error => console.log(error));
  }
}