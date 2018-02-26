require('dotenv').config();
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'ts-helpers';

import { NestFactory } from '@nestjs/core';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as path from 'path';
import * as compression from 'compression';

import { ApplicationModule } from './modules/app.module';
const DIST_FOLDER = path.join(process.cwd(), 'dist');
const DIST_BROWSER_FOLDER = path.join(DIST_FOLDER, 'dist-browser');
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(path.join(DIST_FOLDER, 'dist-bridge', 'main.bundle'));

enableProdMode();
const configuredNgExpressEngine = ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
});

const server = express();

server.engine('html', configuredNgExpressEngine);
server.set('view engine', 'html');
server.set('views', DIST_BROWSER_FOLDER);

const options: cors.CorsOptions = {
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-xsrf-token'],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: [
        'http://localhost:4200',
        'http://localhost:8000',
        'https://universal-demo.ereckgordon.com',
        'https://www.universal-demo.ereckgordon.com',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 200,
};

server.use(compression());
server.get('*.*', express.static(DIST_BROWSER_FOLDER, { maxAge: '1y' }));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(cors(options));
server.options('*', cors(options));

async function bootstrap() {
    const app = await NestFactory.create(ApplicationModule, server, {});
    await app.listen(8000);
}

bootstrap();
