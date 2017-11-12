const util = require('util');

import { DatabaseConnection } from './database-connection';

const db = new DatabaseConnection();

export class API {

  async helloWorld(body){
    try {
      console.log(body)
      const hello = {HELLO: "WORLD"}
      return hello;
    }
    
    catch(error){
      return error;
    }
  }  
}