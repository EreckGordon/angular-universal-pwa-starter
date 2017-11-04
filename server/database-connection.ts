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
    }).then(connection => {
        console.log("DONE connecting!");
        this.connection = connection;
        this.ready = true;
    }).catch(error => console.log(error));
  }
}