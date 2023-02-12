import express, { Request, Response, NextFunction as Next } from "express";

import config from "config";

import * as path from "path";
import bodyParser from "body-parser";

import expressSession from 'express-session';

import promClient from 'prom-client';

import * as Index from "./routes/index";
import * as Login from "./routes/login";

const app = express();

// create a prometheus client registry container.
const register = new promClient.Registry();
register.setDefaultLabels({
  app: 'grafana-prometheus-nodejs',
});

promClient.collectDefaultMetrics({ register });

// add metrics endpoint
app.get('/metrics', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});

app.use(expressSession(
  {
    secret: `asdfghjkl`,
    resave: false,
    saveUninitialized: true
  }
));

app.set('views', path.join(__dirname, '/../src/views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/../src/resources')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(`/`, Index.router);
app.use(`/`, Login.router);

enum ConfigOptions {
  PORT = 'port'
}

let port = 8090;

if (config.has(ConfigOptions.PORT)) {
  port = config.get(ConfigOptions.PORT)
} else {
  console.log(`no port config found, using default ${port}`);
}

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});