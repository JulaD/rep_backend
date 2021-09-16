/* eslint-disable no-console */
import express, { Application } from 'express';
import 'dotenv/config';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import YAML from 'yamljs';
import Routes from './routes';
import logger from './Logger/logger';

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

app.use(Routes);

app.listen(PORT, (): void => {
  console.log(`REPP Backend running here 👉 https://localhost:${PORT}`);
  logger.info('Server initiated');
});
