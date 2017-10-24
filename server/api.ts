const util = require('util');

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