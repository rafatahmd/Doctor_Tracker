/**
 * OpenAPI 3.0 specification for Doctor Tracker API (Swagger UI).
 */

function getConfiguredPublicUrl() {
  const fromEnv = process.env.API_PUBLIC_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 5001}`;
}

/** Prefer API_PUBLIC_URL; otherwise use the host that served the docs (works on Vercel). */
function publicUrlFromRequest(req) {
  const fromEnv = process.env.API_PUBLIC_URL?.trim().replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  const proto = (req.get('x-forwarded-proto') || req.protocol || 'https')
    .split(',')[0]
    .trim();
  const host = (req.get('x-forwarded-host') || req.get('host') || '')
    .split(',')[0]
    .trim();
  if (host) return `${proto}://${host}`;
  return getConfiguredPublicUrl();
}

function createOpenApiSpec(serverUrl = getConfiguredPublicUrl()) {
  return {
    ...openApiBase,
    servers: [{ url: serverUrl, description: 'API server' }],
  };
}

const bearerSecurity = [{ bearerAuth: [] }];

const errorResponse = {
  description: 'Error',
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/ErrorResponse' },
    },
  },
};

const openApiBase = {
  openapi: '3.0.3',
  info: {
    title: 'Doctor Tracker API',
    version: '1.0.0',
    description:
      'REST API for the Doctor Tracker admin app. Use **Authorize** with a JWT from `POST /api/auth/login`.',
  },
  tags: [
    { name: 'Health', description: 'Service status' },
    { name: 'Auth', description: 'Registration and login' },
    { name: 'Doctors', description: 'Doctor CRUD and nested patients' },
    { name: 'Patients', description: 'Patient listing and updates' },
    { name: 'Users', description: 'User management (admin only)' },
    { name: 'Dashboard', description: 'Analytics aggregates' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT from login/register response (`data.token`)',
      },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', enum: ['general', 'admin'] },
        },
      },
      AuthData: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string' },
        },
      },
      Doctor: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          specialization: { type: 'string' },
          hospital: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Patient: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          age: { type: 'integer' },
          gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
          condition: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email', nullable: true },
          doctor: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      RegisterBody: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2, maxLength: 50 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      DoctorBody: {
        type: 'object',
        required: ['name', 'specialization', 'hospital', 'phone'],
        properties: {
          name: { type: 'string' },
          specialization: { type: 'string' },
          hospital: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      PatientBody: {
        type: 'object',
        required: ['name', 'age', 'gender', 'condition', 'phone'],
        properties: {
          name: { type: 'string' },
          age: { type: 'integer', minimum: 0, maximum: 150 },
          gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
          condition: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          doctor: { type: 'string', description: 'MongoDB doctor id (optional on update)' },
        },
      },
      CreateUserBody: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          role: { type: 'string', enum: ['general', 'admin'] },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        security: [],
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } },
          },
        },
        responses: {
          201: {
            description: 'User created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/AuthData' },
                  },
                },
              },
            },
          },
          400: errorResponse,
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } },
          },
        },
        responses: {
          200: {
            description: 'Authenticated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/AuthData' },
                  },
                },
              },
            },
          },
          401: errorResponse,
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Current user profile',
        security: bearerSecurity,
        responses: {
          200: {
            description: 'Profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: { user: { $ref: '#/components/schemas/User' } },
                    },
                  },
                },
              },
            },
          },
          401: errorResponse,
        },
      },
    },
    '/api/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'List doctors (search, filter, pagination)',
        security: bearerSecurity,
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'specialization', in: 'query', schema: { type: 'string' } },
          { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
          { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        ],
        responses: { 200: { description: 'Doctor list' }, 401: errorResponse },
      },
      post: {
        tags: ['Doctors'],
        summary: 'Create doctor (admin)',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DoctorBody' } },
          },
        },
        responses: { 201: { description: 'Created' }, 401: errorResponse, 403: errorResponse },
      },
    },
    '/api/doctors/specializations': {
      get: {
        tags: ['Doctors'],
        summary: 'Distinct specializations',
        security: bearerSecurity,
        responses: { 200: { description: 'String array' }, 401: errorResponse },
      },
    },
    '/api/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get doctor by id',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Doctor' }, 404: errorResponse },
      },
      put: {
        tags: ['Doctors'],
        summary: 'Update doctor (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/DoctorBody' } },
          },
        },
        responses: { 200: { description: 'Updated' }, 403: errorResponse },
      },
      delete: {
        tags: ['Doctors'],
        summary: 'Delete doctor and patients (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' }, 403: errorResponse },
      },
    },
    '/api/doctors/{id}/patients': {
      get: {
        tags: ['Doctors'],
        summary: "Doctor's patients",
        security: bearerSecurity,
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Patient list' } },
      },
      post: {
        tags: ['Doctors'],
        summary: 'Add patient to doctor (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PatientBody' } },
          },
        },
        responses: { 201: { description: 'Patient created' } },
      },
    },
    '/api/doctors/{id}/patients/{patientId}': {
      delete: {
        tags: ['Doctors'],
        summary: 'Remove patient from doctor (admin)',
        security: bearerSecurity,
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'patientId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Removed' } },
      },
    },
    '/api/patients': {
      get: {
        tags: ['Patients'],
        summary: 'List patients',
        security: bearerSecurity,
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'condition', in: 'query', schema: { type: 'string' } },
          { name: 'gender', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Patient list' } },
      },
    },
    '/api/patients/conditions': {
      get: {
        tags: ['Patients'],
        summary: 'Distinct conditions',
        security: bearerSecurity,
        responses: { 200: { description: 'String array' } },
      },
    },
    '/api/patients/{id}': {
      get: {
        tags: ['Patients'],
        summary: 'Get patient',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Patient' } },
      },
      put: {
        tags: ['Patients'],
        summary: 'Update patient (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PatientBody' } },
          },
        },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Patients'],
        summary: 'Delete patient (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List users (admin)',
        security: bearerSecurity,
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Users' }, 403: errorResponse },
      },
      post: {
        tags: ['Users'],
        summary: 'Create user (admin)',
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateUserBody' } },
          },
        },
        responses: { 201: { description: 'Created' } },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'User' } },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/CreateUserBody' } },
          },
        },
        responses: { 200: { description: 'Updated' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user (admin)',
        security: bearerSecurity,
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Deleted' } },
      },
    },
    '/api/dashboard/stats': {
      get: {
        tags: ['Dashboard'],
        summary: 'Dashboard analytics',
        security: bearerSecurity,
        responses: { 200: { description: 'Stats, charts data, recent lists' } },
      },
    },
  },
};

module.exports = createOpenApiSpec;
module.exports.createOpenApiSpec = createOpenApiSpec;
module.exports.getConfiguredPublicUrl = getConfiguredPublicUrl;
module.exports.publicUrlFromRequest = publicUrlFromRequest;
