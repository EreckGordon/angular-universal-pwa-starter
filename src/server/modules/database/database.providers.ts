import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';
import { TypeOrmModule } from '@nestjs/typeorm';

// if needed add other connections with different name then add it to the exported array below.
// and make sure that entities have their respective connection name otherwise it is going to be using the default connection below.
const defaultDB: TypeOrmModuleOptions & Partial<PostgresConnectionOptions> = {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: +process.env.POSTGRES_PORT || 5432,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'testingpass',
    database: process.env.POSTGRES_DATABASE || 'testingDB',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
    cache: true,
};

export const databaseProviders = [TypeOrmModule.forRoot(defaultDB)];
