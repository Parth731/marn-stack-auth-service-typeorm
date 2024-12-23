import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import logger from '../config/logger';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pizza-app Auth service',
      description: 'Pizza-app Auth service API documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // apis: ['./src/routes.ts', './src/schema/*.ts'],
  apis: ['./src/routes/*.ts', './src/entities/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express, port: number): void => {
  // Swagger page
  app.use(
    `${process.env.BASE_URL}/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
  );

  // Docs in JSON format
  app.get(
    `${process.env.BASE_URL}/docs.json`,
    (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    },
  );

  logger.info(
    `Docs available at http://localhost:${port}${process.env.BASE_URL}/docs`,
  );
};

export default swaggerDocs;
