# CodexFlow - Development Guide

> Complete guide for developers contributing to CodexFlow

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Environment](#development-environment)
4. [Coding Standards](#coding-standards)
5. [Git Workflow](#git-workflow)
6. [Testing](#testing)
7. [Debugging](#debugging)
8. [Building Features](#building-features)
9. [Database Development](#database-development)
10. [AI/ML Development](#aiml-development)
11. [Contributing Guidelines](#contributing-guidelines)
12. [Best Practices](#best-practices)

---

## Getting Started

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/codexflow.git
cd codexflow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development servers
npm run dev

# Open in browser
# Frontend: http://localhost:3000
# API: http://localhost:4000
```

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Docker**: For local database services
- **Git**: Version control
- **VS Code**: Recommended editor
- **AWS Account**: For cloud services (optional for local dev)

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "amazonwebservices.aws-toolkit-vscode",
    "vivaxy.vscode-conventional-commits",
    "eamodio.gitlens",
    "github.copilot"
  ]
}
```

---

## Project Structure

```
codexflow/
├── frontend/                    # Next.js frontend application
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   ├── components/         # React components
│   │   ├── lib/                # Utility libraries
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # State management
│   │   └── types/              # TypeScript types
│   ├── public/                 # Static assets
│   ├── tests/                  # Frontend tests
│   ├── package.json
│   └── next.config.js
│
├── services/                    # Backend microservices
│   ├── auth-service/           # Authentication service
│   │   ├── functions/          # Lambda functions
│   │   ├── models/             # Data models
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Business logic
│   │   ├── tests/              # Service tests
│   │   ├── serverless.yml      # Serverless config
│   │   └── package.json
│   ├── project-service/        # Project management
│   ├── task-service/           # Task management
│   ├── ai-service/             # AI/ML features
│   ├── integration-service/    # Third-party integrations
│   └── shared/                 # Shared libraries
│       ├── database/
│       ├── middleware/
│       ├── utils/
│       └── types/
│
├── infrastructure/              # Infrastructure as Code
│   ├── terraform/              # Terraform configurations
│   │   ├── modules/
│   │   ├── environments/
│   │   └── main.tf
│   └── cdk/                    # AWS CDK (alternative)
│
├── scripts/                     # Utility scripts
│   ├── setup-dev.sh
│   ├── deploy-all.sh
│   ├── seed-database.js
│   └── run-migrations.js
│
├── docs/                        # Documentation
│   ├── README.md
│   ├── TECHNICAL_DOCUMENTATION.md
│   ├── USER_GUIDE.md
│   └── ...
│
├── .github/                     # GitHub configuration
│   ├── workflows/              # GitHub Actions
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docker/                      # Docker configurations
│   ├── docker-compose.yml      # Local development
│   └── Dockerfile
│
├── package.json                 # Root package.json
├── tsconfig.json               # TypeScript configuration
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── README.md                   # Main README
```

---

## Development Environment

### Local Setup

#### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend services
cd ../services
for service in */; do
  cd "$service"
  npm install
  cd ..
done
```

#### 2. Set Up Local Databases

```bash
# Start local services with Docker Compose
docker-compose up -d

# This starts:
# - MongoDB (DocumentDB equivalent): localhost:27017
# - Redis (ElastiCache equivalent): localhost:6379
# - LocalStack (AWS services): localhost:4566
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
    environment:
      SERVICES: dynamodb,s3,lambda,sqs,sns,secretsmanager
      DEBUG: 1
    volumes:
      - "./localstack:/etc/localstack/init/ready.d"
      - "/var/run/docker.sock:/var/run/docker.sock"

volumes:
  mongodb_data:
  redis_data:
```

#### 3. Configure Environment Variables

```bash
# .env.local
NODE_ENV=development
STAGE=local

# API Configuration
API_BASE_URL=http://localhost:4000/v1
FRONTEND_URL=http://localhost:3000

# Database
DYNAMODB_ENDPOINT=http://localhost:4566
DYNAMODB_TABLE_PREFIX=codexflow-local
MONGODB_URI=mongodb://admin:password@localhost:27017
REDIS_URL=redis://localhost:6379

# AWS (LocalStack)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://localhost:4566

# Auth (use development Cognito or mock)
COGNITO_USER_POOL_ID=local_mock
COGNITO_CLIENT_ID=local_mock

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_INTEGRATIONS=false

# Logging
LOG_LEVEL=debug
```

#### 4. Seed Database

```bash
# Run database migrations and seed data
npm run db:migrate
npm run db:seed
```

**scripts/seed-database.js**:
```javascript
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

const docClient = DynamoDBDocumentClient.from(client);

async function seedDatabase() {
  // Create test users
  await docClient.send(new PutCommand({
    TableName: 'codexflow-local-main',
    Item: {
      PK: 'USER#test-user-1',
      SK: 'PROFILE',
      userId: 'test-user-1',
      email: 'dev@example.com',
      name: 'Developer User',
      role: 'developer',
      createdAt: new Date().toISOString(),
    },
  }));

  console.log('Database seeded successfully');
}

seedDatabase();
```

### Running Development Servers

#### Frontend (Next.js)

```bash
cd frontend
npm run dev

# Available at http://localhost:3000
```

#### Backend (Serverless Offline)

```bash
cd services/auth-service
npm run dev

# This starts serverless-offline
# API available at http://localhost:4000
```

#### Run All Services

```bash
# Use concurrently to run multiple services
npm run dev:all

# Or use Turbo for monorepo management
npx turbo dev
```

**package.json** (root):
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd services && ./dev-all.sh",
    "dev:all": "concurrently \"npm:dev:frontend\" \"npm:dev:backend\"",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "build": "turbo run build"
  }
}
```

---

## Coding Standards

### TypeScript Guidelines

#### Type Safety

```typescript
// ✅ Good: Explicit types
interface User {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'developer' | 'designer' | 'qa';
}

function getUser(userId: string): Promise<User> {
  // Implementation
}

// ❌ Bad: Any types
function getUser(userId: any): any {
  // Implementation
}
```

#### Naming Conventions

```typescript
// Interfaces and Types: PascalCase
interface ProjectData {
  projectId: string;
  name: string;
}

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

// Variables and functions: camelCase
const userName = 'John Doe';
function fetchUserData() { }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.codexflow.io';

// Classes: PascalCase
class TaskService {
  private repository: TaskRepository;
  
  async createTask(data: CreateTaskDto): Promise<Task> {
    // Implementation
  }
}

// Private methods: _camelCase
class UserService {
  private _validateEmail(email: string): boolean {
    // Implementation
  }
}
```

### Code Organization

#### File Naming

```
# Components: PascalCase
TaskCard.tsx
ProjectList.tsx
AIInsightsPanel.tsx

# Utilities: kebab-case
date-utils.ts
api-client.ts
validation-helpers.ts

# Hooks: use prefix + camelCase
useAuth.ts
useProjects.ts
useDebounce.ts

# Services: PascalCase + .service
TaskService.ts
ProjectService.ts
AuthService.ts

# Types: kebab-case + .types
user.types.ts
project.types.ts
api.types.ts
```

#### Import Order

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// 2. Internal modules
import { TaskService } from '@/services/TaskService';
import { useAuth } from '@/hooks/useAuth';

// 3. Components
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/features/task-card';

// 4. Types
import type { Task, Project } from '@/types';

// 5. Styles
import styles from './TaskList.module.css';
```

### ESLint Configuration

**.eslintrc.js**:
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### Prettier Configuration

**.prettierrc**:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid"
}
```

---

## Git Workflow

### Branch Strategy

```
main                    # Production-ready code
├── develop             # Integration branch
│   ├── feature/xxx     # New features
│   ├── fix/xxx         # Bug fixes
│   ├── refactor/xxx    # Code refactoring
│   └── docs/xxx        # Documentation updates
└── hotfix/xxx          # Production hotfixes
```

### Branch Naming

```bash
# Features
feature/user-authentication
feature/ai-risk-analyzer
feature/slack-integration

# Bug fixes
fix/login-error
fix/task-update-bug

# Refactoring
refactor/database-layer
refactor/api-error-handling

# Documentation
docs/api-reference
docs/deployment-guide
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
<type>(<scope>): <subject>

<body>

<footer>

# Types
feat:     New feature
fix:      Bug fix
docs:     Documentation changes
style:    Code style changes (formatting, etc.)
refactor: Code refactoring
test:     Adding or updating tests
chore:    Maintenance tasks

# Examples
feat(auth): add JWT-based authentication

Implement JWT token generation and validation
using AWS Cognito. Include token refresh mechanism.

Closes #123

---

fix(tasks): resolve task deletion bug

Fixed an issue where deleting a task would not
remove associated subtasks.

Fixes #456

---

docs(api): update endpoint documentation

Add examples for all API endpoints and update
response formats.
```

### Pull Request Process

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/new-feature develop
   ```

2. **Make Changes and Commit**:
   ```bash
   git add .
   git commit -m "feat(feature): add new feature"
   ```

3. **Keep Branch Updated**:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

4. **Push and Create PR**:
   ```bash
   git push origin feature/new-feature
   # Create PR on GitHub
   ```

5. **PR Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated and passing
   - [ ] Documentation updated
   - [ ] No linting errors
   - [ ] Self-review completed
   - [ ] Descriptive PR title and description

6. **Code Review**:
   - At least one approval required
   - Address all comments
   - CI/CD checks must pass

7. **Merge**:
   - Squash and merge (preferred)
   - Delete branch after merge

---

## Testing

### Test Structure

```
tests/
├── unit/                       # Unit tests
│   ├── services/
│   ├── utils/
│   └── models/
├── integration/                # Integration tests
│   ├── api/
│   └── database/
├── e2e/                        # End-to-end tests
│   ├── auth.spec.ts
│   ├── projects.spec.ts
│   └── tasks.spec.ts
└── fixtures/                   # Test data
    ├── users.json
    └── projects.json
```

### Unit Tests (Jest)

```typescript
// services/task-service.test.ts
import { TaskService } from './task-service';
import { TaskRepository } from '../repositories/task-repository';

jest.mock('../repositories/task-repository');

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    taskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
    taskService = new TaskService(taskRepository);
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        projectId: 'proj-123',
        assignee: 'user-456',
      };

      const expectedTask = {
        id: 'task-789',
        ...taskData,
        status: 'todo',
        createdAt: new Date().toISOString(),
      };

      taskRepository.create.mockResolvedValue(expectedTask);

      const result = await taskService.createTask(taskData);

      expect(result).toEqual(expectedTask);
      expect(taskRepository.create).toHaveBeenCalledWith(taskData);
    });

    it('should throw error for invalid data', async () => {
      const invalidData = { title: '' };

      await expect(taskService.createTask(invalidData)).rejects.toThrow(
        'Invalid task data'
      );
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/api/tasks.test.ts
import request from 'supertest';
import { app } from '../../../src/app';
import { setupTestDb, teardownTestDb } from '../../helpers/database';

describe('Tasks API', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  describe('POST /tasks', () => {
    it('should create a task', async () => {
      const response = await request(app)
        .post('/v1/tasks')
        .set('Authorization', `Bearer ${testToken}`)
        .send({
          title: 'Test Task',
          projectId: 'proj-123',
          assignee: 'user-456',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('taskId');
    });
  });
});
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/tasks.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('should create a new task', async ({ page }) => {
    await page.click('text=New Task');
    await page.fill('[name="title"]', 'Test E2E Task');
    await page.selectOption('[name="priority"]', 'high');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Test E2E Task')).toBeVisible();
  });

  test('should update task status', async ({ page }) => {
    await page.click('text=Test E2E Task');
    await page.selectOption('[name="status"]', 'in-progress');
    await page.click('button:has-text("Save")');

    await expect(page.locator('[data-status="in-progress"]')).toBeVisible();
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Specific file
npm test -- TaskService.test.ts
```

---

## Debugging

### VS Code Debug Configuration

**.vscode/launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "cwd": "${workspaceFolder}/frontend"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Debug Lambda Function",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/services/task-service/functions/create/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    },
    {
      "name": "Jest: Current File",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${relativeFile}", "--config", "jest.config.js"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Logging

```typescript
// Use structured logging
import { Logger } from '@/lib/logger';

const logger = new Logger('TaskService');

// Log levels
logger.debug('Debug message', { userId: '123' });
logger.info('Task created', { taskId: '456' });
logger.warn('Potential issue', { reason: 'High load' });
logger.error('Error occurred', { error: error.message, stack: error.stack });

// In production, logs go to CloudWatch
// In development, logs to console with pretty formatting
```

### AWS X-Ray Tracing

```typescript
import AWSXRay from 'aws-xray-sdk-core';

// Instrument AWS SDK
const AWS = AWSXRay.captureAWS(require('aws-sdk'));

// Capture HTTP requests
import http from 'http';
AWSXRay.captureHTTPsGlobal(http);

// Add custom subsegments
const subsegment = AWSXRay.getSegment()?.addNewSubsegment('CustomOperation');
try {
  // Your code
  subsegment?.close();
} catch (error) {
  subsegment?.addError(error);
  subsegment?.close();
}
```

---

## Building Features

### Feature Development Workflow

1. **Plan** the feature
2. **Create** branch
3. **Implement** incrementally
4. **Write** tests
5. **Document** changes
6. **Review** and merge

### Example: Adding a New API Endpoint

#### 1. Define Types

```typescript
// services/shared/types/task.types.ts
export interface CreateTaskDto {
  projectId: string;
  title: string;
  description?: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
}

export interface Task extends CreateTaskDto {
  taskId: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  createdAt: string;
  updatedAt: string;
}
```

#### 2. Create Repository

```typescript
// services/task-service/repositories/task.repository.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Task, CreateTaskDto } from '@shared/types/task.types';
import { generateId } from '@shared/utils/id-generator';

export class TaskRepository {
  private client: DynamoDBDocumentClient;

  constructor() {
    const dynamoClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(dynamoClient);
  }

  async create(data: CreateTaskDto): Promise<Task> {
    const task: Task = {
      taskId: generateId('task'),
      ...data,
      status: 'todo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.client.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        PK: `PROJECT#${data.projectId}`,
        SK: `TASK#${task.taskId}`,
        ...task,
      },
    }));

    return task;
  }
}
```

#### 3. Create Service

```typescript
// services/task-service/services/task.service.ts
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDto, Task } from '@shared/types/task.types';
import { validateTaskData } from '../utils/validators';

export class TaskService {
  constructor(private repository: TaskRepository) {}

  async createTask(data: CreateTaskDto): Promise<Task> {
    // Validate
    validateTaskData(data);

    // Create task
    const task = await this.repository.create(data);

    // Publish event
    await this.publishTaskCreatedEvent(task);

    return task;
  }

  private async publishTaskCreatedEvent(task: Task): Promise<void> {
    // Implementation
  }
}
```

#### 4. Create Lambda Handler

```typescript
// services/task-service/functions/create/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TaskService } from '../../services/task.service';
import { TaskRepository } from '../../repositories/task.repository';
import { authenticate } from '@shared/middleware/auth';
import { validateRequest } from '@shared/middleware/validator';
import { errorHandler } from '@shared/middleware/error-handler';
import { createTaskSchema } from '../../schemas/task.schema';

const taskService = new TaskService(new TaskRepository());

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const user = await authenticate(event);
    const payload = validateRequest(event.body, createTaskSchema);
    
    const task = await taskService.createTask(payload);
    
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: task,
      }),
    };
  } catch (error) {
    return errorHandler(error);
  }
};
```

#### 5. Write Tests

```typescript
// services/task-service/functions/create/index.test.ts
import { handler } from './index';
import { TaskService } from '../../services/task.service';

jest.mock('../../services/task.service');

describe('Create Task Handler', () => {
  it('should create task successfully', async () => {
    const event = {
      body: JSON.stringify({
        projectId: 'proj-123',
        title: 'Test Task',
        priority: 'high',
      }),
      headers: {
        Authorization: 'Bearer valid-token',
      },
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).success).toBe(true);
  });
});
```

#### 6. Update Serverless Configuration

```yaml
# services/task-service/serverless.yml
functions:
  createTask:
    handler: functions/create/index.handler
    events:
      - http:
          path: /tasks
          method: post
          cors: true
          authorizer:
            type: COGNITO_USER_POOLS
            authorizerId: !Ref CognitoAuthorizer
```

---

## Database Development

### DynamoDB Local Development

```bash
# Start DynamoDB Local
docker run -p 8000:8000 amazon/dynamodb-local

# Create table
aws dynamodb create-table \
  --table-name codexflow-local-main \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

### MongoDB Local Development

```javascript
// Connect to local MongoDB
const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://admin:password@localhost:27017');

await client.connect();
const db = client.db('codexflow-dev');

// Create collections and indexes
await db.createCollection('prds');
await db.collection('prds').createIndex({ projectId: 1, version: -1 });
```

---

## AI/ML Development

### Training Models Locally

```python
# scripts/train-risk-model.py
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load training data
data = pd.read_csv('data/training-data.csv')

# Prepare features
X = data[['complexity', 'timeline', 'team_size', 'dependencies']]
y = data['risk_level']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier(n_estimators=100, random_depth=10)
model.fit(X_train, y_train)

# Evaluate
score = model.score(X_test, y_test)
print(f'Accuracy: {score}')

# Save model
joblib.dump(model, 'models/risk-analyzer.pkl')
```

### Testing AI Features

```typescript
// Test AI endpoint
describe('AI Risk Analyzer', () => {
  it('should analyze task risk', async () => {
    const response = await request(app)
      .post('/v1/ai/risk-analysis')
      .send({
        taskId: 'task-123',
      })
      .expect(200);

    expect(response.body.data).toHaveProperty('riskScore');
    expect(response.body.data.riskScore).toBeGreaterThanOrEqual(0);
    expect(response.body.data.riskScore).toBeLessThanOrEqual(1);
  });
});
```

---

## Contributing Guidelines

### Before Contributing

1. Read this guide thoroughly
2. Check existing issues and PRs
3. Discuss major changes first

### Code Review Checklist

**For Authors**:
- [ ] Code follows style guide
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] Self-review completed
- [ ] No sensitive data committed

**For Reviewers**:
- [ ] Code is readable and maintainable
- [ ] Logic is correct
- [ ] Tests are adequate
- [ ] No security issues
- [ ] Performance considerations addressed

---

## Best Practices

### Performance

- Use pagination for large lists
- Implement caching where appropriate
- Optimize database queries
- Minimize Lambda cold starts
- Use CDN for static assets

### Security

- Never commit secrets
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Follow least privilege principle

### Code Quality

- Write self-documenting code
- Keep functions small and focused
- Avoid deep nesting
- Use meaningful variable names
- Comment complex logic

---

**Document Version**: 1.0.0  
**Last Updated**: November 5, 2025  
**Maintained By**: CodexFlow Engineering Team
