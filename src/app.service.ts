import { Injectable } from '@nestjs/common';

interface ApiDocumentation {
  title: string;
  version: string;
  description: string;
  features: string[];
  documentation: {
    swagger: {
      url: string;
      description: string;
    };
  };
  endpoints: {
    users: EndpointInfo;
    credits: EndpointInfo;
    payments: EndpointInfo;
    expenses: EndpointInfo;
  };
  technologies: string[];
  quickStart: {
    development: string[];
    production: string[];
  };
  contact: {
    repository: string;
    maintainer: string;
  };
}

interface EndpointInfo {
  baseUrl: string;
  description: string;
  operations: string[];
}

@Injectable()
export class AppService {
  getHello(): string {
    return this.getApiDocumentationHtml();
  }

  getApiDocumentation(): ApiDocumentation {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    return {
      title: 'API Administración de Créditos',
      version: '1.0.0',
      description:
        'Sistema completo para la gestión de créditos, usuarios y pagos',
      features: [
        '✅ Gestión de usuarios',
        '✅ Administración de créditos',
        '✅ Control de pagos',
        '✅ Gestión de gastos',
        '✅ Cálculo automático de intereses',
        '✅ Validaciones de datos',
        '✅ API RESTful completa',
      ],
      documentation: {
        swagger: {
          url: `${baseUrl}/api`,
          description: 'Documentación interactiva con Swagger UI',
        },
      },
      endpoints: {
        users: {
          baseUrl: `${baseUrl}/users`,
          description: 'Gestión de usuarios del sistema',
          operations: [
            'GET /users - Listar todos los usuarios',
            'GET /users/:id - Obtener usuario por ID',
            'POST /users - Crear nuevo usuario',
            'PUT /users/:id - Actualizar usuario',
            'DELETE /users/:id - Eliminar usuario',
          ],
        },
        credits: {
          baseUrl: `${baseUrl}/credits`,
          description: 'Administración de créditos',
          operations: [
            'GET /credits - Listar todos los créditos',
            'GET /credits?showExpenses=true/false - Filtrar por módulo gastos habilitado',
            'GET /credits/with-expenses-enabled - Créditos con módulo gastos habilitado',
            'GET /credits/without-expenses-enabled - Créditos con módulo gastos deshabilitado',
            'GET /credits/:id - Obtener crédito por ID',
            'POST /credits - Crear nuevo crédito',
            'PUT /credits/:id - Actualizar crédito',
            'DELETE /credits/:id - Eliminar crédito',
          ],
        },
        payments: {
          baseUrl: `${baseUrl}/payments`,
          description: 'Control de pagos',
          operations: [
            'GET /payments - Listar todos los pagos',
            'GET /payments/:id - Obtener pago por ID',
            'POST /payments - Registrar nuevo pago',
            'PUT /payments/:id - Actualizar pago',
            'DELETE /payments/:id - Eliminar pago',
          ],
        },
        expenses: {
          baseUrl: `${baseUrl}/expenses`,
          description: 'Gestión de gastos',
          operations: [
            'GET /expenses - Listar todos los gastos',
            'GET /expenses/:id - Obtener gasto por ID',
            'GET /expenses/credit/:creditId - Obtener gastos por crédito',
            'GET /expenses/total - Obtener total de gastos',
            'GET /expenses/total/month - Obtener total por mes',
            'GET /expenses/total/credit/:creditId - Obtener total por crédito',
            'GET /expenses/date-range - Obtener gastos por rango de fechas',
            'POST /expenses - Crear nuevo gasto',
            'PUT /expenses/:id - Actualizar gasto',
            'DELETE /expenses/:id - Eliminar gasto',
          ],
        },
      },
      technologies: [
        'NestJS - Framework Node.js',
        'TypeScript - Lenguaje de programación',
        'Sequelize - ORM para base de datos',
        'Swagger - Documentación de API',
        'Jest - Testing framework',
      ],
      quickStart: {
        development: ['npm install', 'npm run start:dev'],
        production: ['npm run build', 'npm run start:prod'],
      },
      contact: {
        repository: 'credits-manage-backend',
        maintainer: 'cesarosorio',
      },
    };
  }

  getApiDocumentationHtml(): string {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    const documentation = this.getApiDocumentation();

    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentation.title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        .badge {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            margin-right: 10px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 10px;
            margin: 20px 0;
        }
        .feature {
            background: #ecf0f1;
            padding: 10px;
            border-radius: 5px;
            border-left: 4px solid #27ae60;
        }
        .endpoint-card {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 15px 0;
        }
        .endpoint-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #495057;
            margin-bottom: 10px;
        }
        .operations {
            background: white;
            padding: 15px;
            border-radius: 5px;
            margin-top: 10px;
        }
        .operation {
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        .operation:last-child {
            border-bottom: none;
        }
        .method {
            font-weight: bold;
            color: #e74c3c;
            margin-right: 10px;
        }
        .btn {
            display: inline-block;
            background: #3498db;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 10px 10px 0;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #2980b9;
        }
        .btn-success {
            background: #27ae60;
        }
        .btn-success:hover {
            background: #219a52;
        }
        .tech-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin: 20px 0;
        }
        .tech-item {
            background: #e8f4fd;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }
        .quick-start {
            background: #f1f2f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .command {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 8px 12px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            margin: 5px 0;
            display: block;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 ${documentation.title}</h1>
        <p class="badge">v${documentation.version}</p>
        
        <p style="font-size: 1.1em; color: #666;">
            ${documentation.description}
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="${documentation.documentation.swagger.url}" class="btn btn-success" target="_blank">
                📚 Ver Documentación Swagger
            </a>
            <a href="${baseUrl}/readme" class="btn" target="_blank">
                🔄 Ver JSON API
            </a>
        </div>

        <h2>✨ Características</h2>
        <div class="features">
            ${documentation.features
              .map((feature) => `<div class="feature">${feature}</div>`)
              .join('')}
        </div>

        <h2>🚀 Endpoints Disponibles</h2>
        
        <div class="endpoint-card">
            <div class="endpoint-title">👥 Usuarios</div>
            <p>${documentation.endpoints.users.description}</p>
            <a href="${documentation.endpoints.users.baseUrl}" class="btn" target="_blank">Explorar Users API</a>
            <div class="operations">
                ${documentation.endpoints.users.operations
                  .map((op) => {
                    const [method, ...rest] = op.split(' ');
                    return `<div class="operation"><span class="method">${method}</span>${rest.join(' ')}</div>`;
                  })
                  .join('')}
            </div>
        </div>

        <div class="endpoint-card">
            <div class="endpoint-title">💳 Créditos</div>
            <p>${documentation.endpoints.credits.description}</p>
            <a href="${documentation.endpoints.credits.baseUrl}" class="btn" target="_blank">Explorar Credits API</a>
            <div class="operations">
                ${documentation.endpoints.credits.operations
                  .map((op) => {
                    const [method, ...rest] = op.split(' ');
                    return `<div class="operation"><span class="method">${method}</span>${rest.join(' ')}</div>`;
                  })
                  .join('')}
            </div>
        </div>

        <div class="endpoint-card">
            <div class="endpoint-title">💰 Pagos</div>
            <p>${documentation.endpoints.payments.description}</p>
            <a href="${documentation.endpoints.payments.baseUrl}" class="btn" target="_blank">Explorar Payments API</a>
            <div class="operations">
                ${documentation.endpoints.payments.operations
                  .map((op) => {
                    const [method, ...rest] = op.split(' ');
                    return `<div class="operation"><span class="method">${method}</span>${rest.join(' ')}</div>`;
                  })
                  .join('')}
            </div>
        </div>

        <div class="endpoint-card">
            <div class="endpoint-title">💸 Gastos</div>
            <p>${documentation.endpoints.expenses.description}</p>
            <a href="${documentation.endpoints.expenses.baseUrl}" class="btn" target="_blank">Explorar Expenses API</a>
            <div class="operations">
                ${documentation.endpoints.expenses.operations
                  .map((op) => {
                    const [method, ...rest] = op.split(' ');
                    return `<div class="operation"><span class="method">${method}</span>${rest.join(' ')}</div>`;
                  })
                  .join('')}
            </div>
        </div>

        <h2>🛠️ Tecnologías</h2>
        <div class="tech-list">
            ${documentation.technologies
              .map((tech) => `<div class="tech-item">${tech}</div>`)
              .join('')}
        </div>

        <h2>⚡ Inicio Rápido</h2>
        <div class="quick-start">
            <h3>Desarrollo</h3>
            ${documentation.quickStart.development
              .map((cmd) => `<code class="command">${cmd}</code>`)
              .join('')}
            
            <h3>Producción</h3>
            ${documentation.quickStart.production
              .map((cmd) => `<code class="command">${cmd}</code>`)
              .join('')}
        </div>

        <h2>📞 Contacto</h2>
        <p>
            <strong>Repositorio:</strong> ${documentation.contact.repository}<br>
            <strong>Mantenedor:</strong> ${documentation.contact.maintainer}
        </p>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        <p style="text-align: center; color: #666; font-size: 0.9em;">
            Generado automáticamente - ${new Date().toLocaleString('es-ES')}
        </p>
    </div>
</body>
</html>`;
  }
}
