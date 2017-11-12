/* tslint:disable no-console */
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'ts-helpers';
//import 'rxjs/Rx';

import * as express from 'express';
import * as path from 'path';
const compression = require('compression');

import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
enableProdMode();
const AppServerModuleNgFactory = require('../dist-server/main.bundle').AppServerModuleNgFactory;

import { API } from './api';

const app = express();
const api = new API();

const baseUrl = `http://localhost:8000`;
const bodyParser = require('body-parser');
import * as cors from 'cors';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', 'src');

const options:cors.CorsOptions = {
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: ['http://localhost:4200', 'http://localhost:8000'],
  preflightContinue: false,
  optionsSuccessStatus: 200
};
app.use(cors(options));
app.options("*", cors(options));

app.use(compression());
app.use('/', express.static('dist', { index: false }));
app.use('/assets', express.static(path.join(__dirname, 'assets'), { maxAge: 30 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const routes: string[] = [
  '',
  'about',
  'blog/*',
  '*'
];

routes.forEach(route => {
  app.get('/' + route, (req, res) => {
    console.time(`GET: ${req.originalUrl}`);
    res.render('../dist/index', {
      req: req,
      res: res
    });
    console.timeEnd(`GET: ${req.originalUrl}`);
  });
});

app.post('/api/data', cors(options), (req, res, next) => {
  console.time(`GET: ${req.originalUrl}`);
  api.helloWorld(req.body).then(value => res.json(value));
  console.timeEnd(`GET: ${req.originalUrl}`);
});

app.listen(8000, () => {
  console.log(`Listening at ${baseUrl}`);
});
