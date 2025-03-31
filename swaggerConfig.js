import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskProApp',
      version: '1.0.0',
      description: 'Documentație interactivă pentru API-ul aplicației TaskPro',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Server local',
      },
    ],
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
    tags: [
      {
        name: 'Auth',
        description: 'Tot ce ține de autentificare și înregistrare',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // caută comentariile Swagger în rute
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };



