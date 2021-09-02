/* eslint-disable no-console */
import express, { Application } from 'express';

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app: Application = express();
const PORT = process.env.PORT || 8000;

// swagger init
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'REPP Rest API',
      description: '',
      servers: ['http://localhost:3000'],
    },
  },
  apis: ['src/routes.ts'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// middlewares
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(require('./routes.ts'));

app.listen(PORT, (): void => {
  console.log(`REPP Backend running here 👉 https://localhost:${PORT}`);
});

function q() {
  return NaN;
}
