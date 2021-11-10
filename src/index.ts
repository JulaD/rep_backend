/* eslint-disable import/first */
/* eslint-disable no-console */
require('dotenv').config();

import { ValidationError } from 'express-json-validator-middleware';
import express, {
  Application,
  NextFunction,
  Request,
  Response,
} from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import YAML from 'yamljs';
import Routes from './routes';
import logger from './Logger/logger';
import ParameterDataBaseLoader from './Loaders/ParameterDataBaseLoader';

const app: Application = express();
const PORT = process.env.PORT || 8000;
app.use(helmet.hidePoweredBy());
// swagger init
const swaggerDocument = YAML.load('./swagger.yaml');
// middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json({
  limit: '50mb',
}));
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

app.use(express.raw({
  limit: '50mb',
}));

app.use((req, res, next) => {
  const reqToLog = {
    body: { ...req.body },
    hostname: req.hostname,
    ip: req.ip,
    method: req.method,
    params: { ...req.params },
    path: req.path,
    protocol: req.protocol,
    query: { ...req.query },
    secure: req.secure,
  };

  // before logging the request, we have to hide sensitive information
  if (typeof reqToLog.body.password !== 'undefined') {
    reqToLog.body.password = '__HIDDEN__';
  }

  logger.info('Request received', { request: reqToLog });
  next();
});

app.use(Routes);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  // Check the error is a validation error
  if (error instanceof ValidationError) {
    // TODO: Handle error message accordingly
    let msg: string | undefined;
    if (error.validationErrors.body && error.validationErrors.body[0]) {
      msg = error.validationErrors.body[0].message;
    }
    if (msg) {
      response.status(400).send(msg);
    }
    next();
  } else {
    // Pass error on if not a validation error
    next(error);
  }
});

ParameterDataBaseLoader.initParameterDataBase();

app.listen(PORT, (): void => {
  console.log(`REPP Backend running here 👉 http://localhost:${PORT}`);
  logger.info('Server initiated');
});
