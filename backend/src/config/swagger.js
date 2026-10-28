const swaggerUi = require('swagger-ui-express');
const { createOpenApiSpec, publicUrlFromRequest } = require('./openapi');

/** Match swagger-ui-dist bundled with swagger-ui-express (CDN fallback for serverless). */
const SWAGGER_UI_DIST_VERSION = '5.34.0';

const swaggerSetupOptions = {
  customSiteTitle: 'Doctor Tracker API Docs',
  customCssUrl: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_DIST_VERSION}/swagger-ui.css`,
  customJs: [
    `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_DIST_VERSION}/swagger-ui-bundle.js`,
    `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_DIST_VERSION}/swagger-ui-standalone-preset.js`,
  ],
  swaggerOptions: {
    url: '/api/docs.json',
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

function mountSwagger(app) {
  // Static assets only — do NOT run setup() for these paths (was returning HTML → MIME errors).
  app.use('/api/docs', swaggerUi.serve);

  const renderDocs = (req, res, next) => {
    const spec = createOpenApiSpec(publicUrlFromRequest(req));
    return swaggerUi.setup(spec, swaggerSetupOptions)(req, res, next);
  };

  app.get('/api/docs', renderDocs);
  app.get('/api/docs/', renderDocs);

  app.get('/api/docs.json', (req, res) => {
    res.json(createOpenApiSpec(publicUrlFromRequest(req)));
  });
}

module.exports = { mountSwagger, createOpenApiSpec, publicUrlFromRequest };
