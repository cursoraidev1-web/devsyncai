# CodexFlow - System Architecture

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [AWS Serverless Infrastructure](#aws-serverless-infrastructure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Design](#database-design)
6. [AI/ML Pipeline](#aiml-pipeline)
7. [Security Architecture](#security-architecture)
8. [Network Architecture](#network-architecture)
9. [Data Flow](#data-flow)
10. [Scalability Strategy](#scalability-strategy)
11. [High Availability & Disaster Recovery](#high-availability--disaster-recovery)
12. [Cost Optimization](#cost-optimization)

---

## Architecture Overview

CodexFlow is built on a **serverless-first, event-driven, microservices architecture** leveraging AWS cloud services. This approach provides:

- **Zero server management**: Focus on code, not infrastructure
- **Automatic scaling**: Handle any workload from 10 to 10,000+ users
- **Cost efficiency**: Pay only for what you use
- **High availability**: Multi-AZ deployment by default
- **Global reach**: CloudFront CDN for worldwide distribution

### Architectural Principles

1. **Serverless-First**: All compute workloads run on Lambda
2. **Event-Driven**: Loosely coupled services communicate via events
3. **Microservices**: Independent, deployable service units
4. **API-First**: Well-defined contracts between services
5. **Infrastructure as Code**: Everything versioned and reproducible
6. **Security by Design**: Defense in depth at every layer
7. **Observability**: Comprehensive logging, monitoring, and tracing

---

## AWS Serverless Infrastructure

### Regional Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Route 53 (DNS)                              │
│                   codexflow.io → CloudFront                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AWS CloudFront (Global CDN)                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Edge Locations: 300+ worldwide                              │  │
│  │  - Static asset caching (1 year TTL)                        │  │
│  │  - API response caching (5 min TTL)                         │  │
│  │  - Lambda@Edge for personalization                          │  │
│  │  - DDoS protection (AWS Shield Standard)                    │  │
│  │  - SSL/TLS termination                                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                ┌────────────────┴──────────────┐
                │                               │
                ▼                               ▼
┌───────────────────────────┐     ┌───────────────────────────┐
│    Origin: S3 + Amplify   │     │  Origin: API Gateway      │
│    (Static Web Assets)    │     │    (Dynamic APIs)         │
└───────────────────────────┘     └───────────┬───────────────┘
                                              │
                                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          PRIMARY REGION (us-east-1)                  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     VPC (Virtual Private Cloud)              │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────┐    │   │
│  │  │  Public Subnets (Multi-AZ: us-east-1a, 1b, 1c)   │    │   │
│  │  │  - NAT Gateway                                     │    │   │
│  │  │  - Application Load Balancer (optional)           │    │   │
│  │  └────────────────────────────────────────────────────┘    │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────┐    │   │
│  │  │  Private Subnets (Multi-AZ)                       │    │   │
│  │  │  ┌──────────────────────────────────────────┐    │    │   │
│  │  │  │    AWS Lambda Functions                  │    │    │   │
│  │  │  │  - API handlers (Node.js 18)            │    │    │   │
│  │  │  │  - Background workers                    │    │    │   │
│  │  │  │  - Event processors                      │    │    │   │
│  │  │  │  - VPC ENI for database access          │    │    │   │
│  │  │  └──────────────────────────────────────────┘    │    │   │
│  │  │                                                    │    │   │
│  │  │  ┌──────────────────────────────────────────┐    │    │   │
│  │  │  │    Database Tier                         │    │    │   │
│  │  │  │  - DocumentDB Cluster (3 nodes)         │    │    │   │
│  │  │  │  - ElastiCache Redis Cluster            │    │    │   │
│  │  │  └──────────────────────────────────────────┘    │    │   │
│  │  └────────────────────────────────────────────────────┘    │   │
│  │                                                              │   │
│  │  Security Groups & NACLs for network segmentation          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                 Serverless Services (Managed)                │   │
│  │                                                              │   │
│  │  • DynamoDB (Multi-AZ, Global Tables ready)                │   │
│  │  • S3 Buckets (Versioning, Lifecycle, Replication)        │   │
│  │  • Cognito User Pools (Authentication)                     │   │
│  │  • SageMaker (ML model training & inference)               │   │
│  │  • EventBridge (Event routing)                             │   │
│  │  • SQS (Message queuing)                                   │   │
│  │  • SNS (Notifications)                                     │   │
│  │  • Step Functions (Workflow orchestration)                 │   │
│  │  • Secrets Manager (Credential storage)                    │   │
│  │  • KMS (Encryption key management)                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              Observability & Operations                      │   │
│  │                                                              │   │
│  │  • CloudWatch (Logs, Metrics, Alarms)                      │   │
│  │  • X-Ray (Distributed tracing)                             │   │
│  │  • CloudTrail (Audit logging)                              │   │
│  │  • AWS Config (Configuration tracking)                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                     SECONDARY REGION (us-west-2)                     │
│                       (Disaster Recovery)                            │
│                                                                       │
│  • S3 Cross-Region Replication                                      │
│  • DynamoDB Global Tables (eventual consistency)                    │
│  • Warm standby Lambda functions                                    │
│  • Route 53 Health Checks & Failover                                │
└─────────────────────────────────────────────────────────────────────┘
```

### AWS Service Stack

#### **Compute Layer**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **AWS Lambda** | Primary compute for all backend logic | Node.js 18, Python 3.9; 512MB-3GB memory; 30s-15min timeout |
| **Lambda Layers** | Shared dependencies and utilities | Common libraries, AWS SDK, helper functions |
| **Lambda@Edge** | Edge computing for personalization | CloudFront request/response manipulation |

#### **API & Application Layer**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **API Gateway (HTTP API)** | Primary API endpoint | WebSocket support, JWT authorizer, $default stage |
| **API Gateway (REST API)** | Complex features (request validation) | Cognito authorizer, Usage plans, API keys |
| **AWS AppSync** | GraphQL API (future enhancement) | Real-time subscriptions, federated data sources |
| **AWS Amplify** | Frontend hosting & CI/CD | Next.js SSR support, custom domain, atomic deployments |

#### **Data Layer**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **DynamoDB** | Primary NoSQL database | On-demand billing, GSIs, Streams, PITR enabled |
| **DocumentDB** | MongoDB-compatible document store | 3-node cluster, r5.large instances, auto-failover |
| **ElastiCache Redis** | Caching & session store | Cluster mode enabled, r5.large nodes, Multi-AZ |
| **S3** | Object storage | Versioning, lifecycle, encryption, cross-region replication |
| **RDS (optional)** | Relational data (if needed) | PostgreSQL, Multi-AZ, automated backups |

#### **AI/ML Layer**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **SageMaker** | Model training & deployment | On-demand instances, model monitoring |
| **Bedrock** | Foundation models (LLMs) | Claude, GPT-4 access via API |
| **Comprehend** | NLP services | Sentiment analysis, entity extraction |
| **Rekognition** | Image/video analysis | Logo detection, content moderation |
| **Lambda (Python)** | Custom ML inference | FastAPI, scikit-learn, TensorFlow |

#### **Integration Layer**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **EventBridge** | Event bus for microservices | Custom event buses, scheduled rules |
| **SQS** | Message queuing | Standard & FIFO queues, DLQ |
| **SNS** | Pub/sub notifications | Email, SMS, webhooks, Lambda triggers |
| **Step Functions** | Workflow orchestration | Express & Standard workflows |

#### **Security Layer**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **Cognito** | User authentication | User pools, identity pools, MFA |
| **IAM** | Access management | Least privilege roles, service accounts |
| **Secrets Manager** | Secret storage | Auto-rotation, KMS encryption |
| **KMS** | Encryption keys | CMKs per environment, key rotation |
| **WAF** | Web application firewall | Rate limiting, SQL injection protection |
| **Shield Standard** | DDoS protection | Included with CloudFront |
| **Certificate Manager** | SSL/TLS certificates | Auto-renewal, wildcard certs |

#### **Monitoring & Operations**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **CloudWatch** | Logging & monitoring | Log groups, metric alarms, dashboards |
| **X-Ray** | Distributed tracing | Sampling rules, service maps |
| **CloudTrail** | Audit logging | Multi-region trail, S3 storage |
| **Config** | Configuration tracking | Compliance rules, change tracking |
| **Systems Manager** | Parameter store | Configuration management |

#### **CI/CD Pipeline**

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **CodePipeline** | Orchestration | Multi-stage pipeline, approval gates |
| **CodeBuild** | Build & test | Docker containers, parallel builds |
| **CodeDeploy** | Deployment | Blue/green, canary, rollback |
| **CloudFormation** | IaC deployment | Nested stacks, change sets |

---

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: React 18
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand (client), TanStack Query (server)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright

### Application Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                  # Auth routes group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/             # Protected routes
│   │   │   ├── layout.tsx          # Dashboard layout
│   │   │   ├── page.tsx            # Dashboard home
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx        # Projects list
│   │   │   │   ├── [id]/           # Project detail
│   │   │   │   └── new/            # Create project
│   │   │   ├── tasks/
│   │   │   ├── analytics/
│   │   │   └── settings/
│   │   ├── api/                     # API routes (BFF pattern)
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   └── tasks/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                      # Base UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── features/                # Feature components
│   │   │   ├── project-card/
│   │   │   ├── task-list/
│   │   │   ├── ai-insights/
│   │   │   └── ...
│   │   ├── layouts/                 # Layout components
│   │   │   ├── header.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── footer.tsx
│   │   └── providers/               # Context providers
│   ├── lib/
│   │   ├── api-client.ts           # API client (axios)
│   │   ├── auth.ts                 # Auth utilities
│   │   ├── constants.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-projects.ts
│   │   ├── use-tasks.ts
│   │   └── ...
│   ├── store/
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── ...
│   ├── types/
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── ...
│   └── styles/
├── public/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── package.json
```

### State Management Strategy

**Client State (Zustand)**:
- UI state (sidebar open/close, modals)
- User preferences (theme, language)
- Temporary form data

**Server State (TanStack Query)**:
- API data caching
- Automatic refetching
- Optimistic updates
- Pagination & infinite scroll

### Rendering Strategy

| Route Type | Rendering | Reason |
|------------|-----------|--------|
| Landing page | Static (SSG) | SEO, fast load |
| Dashboard | Client-side | Real-time updates, interactivity |
| Project list | Server-side (SSR) | Fresh data, SEO |
| User settings | Client-side | Interactive forms |

### Build & Deployment

```yaml
Build Process:
  1. Type checking (tsc)
  2. Linting (ESLint)
  3. Unit tests (Jest)
  4. Build (next build)
  5. E2E tests (Playwright)
  6. Deploy to Amplify/S3

Deployment:
  - AWS Amplify (managed)
  - Or: S3 + CloudFront (custom)
  - Atomic deployments
  - Instant rollback
```

---

## Backend Architecture

### Microservices Design

CodexFlow backend is composed of independent microservices:

```
services/
├── auth-service/              # Authentication & authorization
├── user-service/              # User management
├── project-service/           # Project CRUD
├── task-service/              # Task management
├── prd-service/               # PRD document management
├── ai-service/                # AI/ML features
├── integration-service/       # Third-party integrations
├── notification-service/      # Notifications & alerts
├── analytics-service/         # Data analytics
└── shared/                    # Shared libraries
    ├── database/
    ├── middleware/
    └── utils/
```

### Service Structure (Example: Task Service)

```
task-service/
├── functions/
│   ├── create-task/
│   │   ├── index.ts           # Lambda handler
│   │   ├── schema.ts          # Validation schema
│   │   └── handler.test.ts
│   ├── update-task/
│   ├── delete-task/
│   ├── get-task/
│   └── list-tasks/
├── models/
│   └── task.model.ts
├── repositories/
│   └── task.repository.ts
├── services/
│   └── task.service.ts
├── utils/
│   ├── validators.ts
│   └── transformers.ts
├── serverless.yml             # Service definition
├── package.json
└── tsconfig.json
```

### Lambda Function Structure

```typescript
// Typical Lambda handler structure
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validateRequest } from '@shared/middleware/validator';
import { authenticate } from '@shared/middleware/auth';
import { errorHandler } from '@shared/middleware/error-handler';
import { TaskService } from './services/task.service';
import { createTaskSchema } from './schemas/task.schema';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // 1. Authentication
    const user = await authenticate(event);
    
    // 2. Validation
    const payload = validateRequest(event.body, createTaskSchema);
    
    // 3. Business Logic
    const taskService = new TaskService();
    const task = await taskService.createTask(user.id, payload);
    
    // 4. Response
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        data: task,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: event.requestContext.requestId,
        },
      }),
    };
  } catch (error) {
    return errorHandler(error);
  }
};
```

### API Gateway Configuration

```yaml
# serverless.yml excerpt
functions:
  createTask:
    handler: functions/create-task/index.handler
    events:
      - http:
          path: /tasks
          method: post
          cors: true
          authorizer:
            type: COGNITO_USER_POOLS
            authorizerId: !Ref CognitoAuthorizer
    environment:
      DYNAMODB_TABLE: ${self:custom.tasksTable}
      DOCUMENTDB_URI: ${ssm:/codexflow/${self:provider.stage}/documentdb/uri}
      REDIS_ENDPOINT: ${ssm:/codexflow/${self:provider.stage}/redis/endpoint}
    vpc:
      securityGroupIds:
        - !Ref LambdaSecurityGroup
      subnetIds:
        - !Ref PrivateSubnetA
        - !Ref PrivateSubnetB
    reservedConcurrency: 100
    timeout: 30
    memorySize: 1024
```

### Event-Driven Communication

```typescript
// Publishing events via EventBridge
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const eventBridge = new EventBridgeClient({});

async function publishTaskCreatedEvent(task: Task) {
  await eventBridge.send(new PutEventsCommand({
    Entries: [{
      Source: 'codexflow.tasks',
      DetailType: 'TaskCreated',
      Detail: JSON.stringify({
        taskId: task.id,
        projectId: task.projectId,
        assignee: task.assignee,
        createdAt: task.createdAt,
      }),
      EventBusName: 'codexflow-events',
    }],
  }));
}

// Consuming events in another service
export const handler = async (event: EventBridgeEvent) => {
  const { taskId, assignee } = event.detail;
  
  // Send notification to assignee
  await notificationService.sendTaskAssignment(assignee, taskId);
};
```

---

## Database Design

### DynamoDB Table Design

**Single-Table Design Pattern**:

```
Table: codexflow-main
Partition Key: PK
Sort Key: SK
GSI1: GSI1PK, GSI1SK
GSI2: GSI2PK, GSI2SK
```

**Access Patterns**:

| Pattern | PK | SK | GSI |
|---------|----|----|-----|
| Get user by ID | `USER#<id>` | `PROFILE` | - |
| Get user by email | - | - | GSI1: `EMAIL#<email>` |
| Get project by ID | `PROJECT#<id>` | `METADATA` | - |
| List user's projects | - | - | GSI1: `OWNER#<userId>` |
| Get task by ID | `PROJECT#<projectId>` | `TASK#<taskId>` | - |
| List user's tasks | - | - | GSI1: `ASSIGNEE#<userId>` |
| Get project tasks | `PROJECT#<projectId>` | begins_with(`TASK#`) | - |

**Example Items**:

```json
// User Item
{
  "PK": "USER#123",
  "SK": "PROFILE",
  "userId": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "GSI1PK": "EMAIL#user@example.com",
  "GSI1SK": "USER"
}

// Project Item
{
  "PK": "PROJECT#456",
  "SK": "METADATA",
  "projectId": "456",
  "name": "CodexFlow MVP",
  "owner": "USER#123",
  "GSI1PK": "OWNER#123",
  "GSI1SK": "PROJECT#456"
}

// Task Item
{
  "PK": "PROJECT#456",
  "SK": "TASK#789",
  "taskId": "789",
  "projectId": "456",
  "title": "Implement login",
  "assignee": "USER#123",
  "GSI1PK": "ASSIGNEE#123",
  "GSI1SK": "TASK#789"
}
```

### DocumentDB Schema

```javascript
// PRD Collection
{
  _id: ObjectId("..."),
  projectId: "456",
  version: 1,
  title: "CodexFlow MVP Requirements",
  content: {
    overview: "...",
    objectives: ["..."],
    requirements: {
      functional: ["..."],
      nonFunctional: ["..."]
    },
    userStories: [
      {
        id: "US-001",
        description: "As a user...",
        acceptanceCriteria: ["..."]
      }
    ]
  },
  aiGenerated: true,
  approvalStatus: "approved",
  createdBy: "USER#123",
  createdAt: ISODate("2025-11-05T00:00:00Z"),
  updatedAt: ISODate("2025-11-05T00:00:00Z")
}

// Analytics Collection
{
  _id: ObjectId("..."),
  projectId: "456",
  date: ISODate("2025-11-05T00:00:00Z"),
  metrics: {
    tasksCompleted: 5,
    velocity: 8.5,
    teamEfficiency: 0.87
  },
  teamStats: [
    {
      userId: "123",
      tasksCompleted: 3,
      hoursLogged: 24
    }
  ]
}
```

### Redis Cache Strategy

```
Key Patterns:
- user:<userId>              -> User object (TTL: 1h)
- project:<projectId>         -> Project object (TTL: 15min)
- tasks:user:<userId>         -> User's task list (TTL: 5min)
- session:<sessionId>         -> User session (TTL: 24h)
- rate_limit:<userId>         -> Rate limit counter (TTL: 1min)
```

---

## AI/ML Pipeline

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AI/ML Pipeline                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Data       │────▶│  Training    │────▶│   Model      │
│ Collection   │     │  Pipeline    │     │  Registry    │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                   │
                                                   ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│  API Gateway │────▶│   Lambda     │
│  (User Req)  │     │              │     │ (Inference)  │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                   │
                                                   ▼
                                         ┌──────────────────┐
                                         │  SageMaker       │
                                         │  Endpoint        │
                                         └──────────────────┘
```

### Model Training (SageMaker)

```python
# Training script
import sagemaker
from sagemaker.sklearn import SKLearn

# Define training job
sklearn_estimator = SKLearn(
    entry_point='train.py',
    role='SageMakerRole',
    instance_type='ml.m5.large',
    framework_version='1.0-1',
    py_version='py3',
    hyperparameters={
        'n_estimators': 100,
        'max_depth': 10,
    }
)

# Start training
sklearn_estimator.fit({'training': 's3://codexflow-ml/training-data/'})

# Deploy model
predictor = sklearn_estimator.deploy(
    initial_instance_count=1,
    instance_type='ml.t2.medium',
    endpoint_name='codexflow-risk-analyzer'
)
```

### Inference (Lambda + SageMaker)

```typescript
// Lambda inference handler
import { SageMakerRuntimeClient, InvokeEndpointCommand } from '@aws-sdk/client-sagemaker-runtime';

const sagemaker = new SageMakerRuntimeClient({});

export const handler = async (event) => {
  const { projectId, taskData } = JSON.parse(event.body);
  
  // Prepare features
  const features = extractFeatures(taskData);
  
  // Invoke SageMaker endpoint
  const response = await sagemaker.send(new InvokeEndpointCommand({
    EndpointName: 'codexflow-risk-analyzer',
    Body: JSON.stringify(features),
    ContentType: 'application/json',
  }));
  
  // Parse prediction
  const prediction = JSON.parse(response.Body.toString());
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      riskScore: prediction.score,
      riskLevel: prediction.level,
      recommendations: prediction.recommendations,
    }),
  };
};
```

---

## Security Architecture

### Multi-Layer Security

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Network Security                              │
│  - CloudFront (DDoS protection via Shield)             │
│  - WAF (SQL injection, XSS protection)                 │
│  - Route 53 (DNS security)                             │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: API Security                                  │
│  - API Gateway (throttling, API keys)                  │
│  - Cognito Authorizer (JWT validation)                 │
│  - Request validation                                   │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: Application Security                          │
│  - Lambda (IAM roles, least privilege)                 │
│  - Input validation (Joi, Zod)                         │
│  - Output encoding                                      │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 4: Data Security                                 │
│  - Encryption at rest (KMS)                            │
│  - Encryption in transit (TLS 1.3)                     │
│  - Field-level encryption                               │
└─────────────────────────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 5: Network Isolation                             │
│  - VPC (private subnets)                               │
│  - Security Groups (whitelist rules)                   │
│  - NACLs (network ACLs)                                │
└─────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
1. User submits credentials
   ↓
2. API Gateway → Lambda (auth-service)
   ↓
3. Cognito validates credentials
   ↓
4. Cognito returns tokens:
   - ID Token (user identity)
   - Access Token (API authorization)
   - Refresh Token (token renewal)
   ↓
5. Frontend stores tokens (httpOnly cookies)
   ↓
6. Subsequent requests include Access Token
   ↓
7. API Gateway validates token with Cognito
   ↓
8. If valid, forward to Lambda
   If invalid, return 401
```

---

## Network Architecture

### VPC Configuration

```
VPC: 10.0.0.0/16

Availability Zones: us-east-1a, us-east-1b, us-east-1c

Public Subnets:
  - 10.0.1.0/24 (AZ-a) - NAT Gateway, ALB
  - 10.0.2.0/24 (AZ-b) - NAT Gateway
  - 10.0.3.0/24 (AZ-c) - NAT Gateway

Private Subnets (Lambda):
  - 10.0.11.0/24 (AZ-a)
  - 10.0.12.0/24 (AZ-b)
  - 10.0.13.0/24 (AZ-c)

Private Subnets (Database):
  - 10.0.21.0/24 (AZ-a)
  - 10.0.22.0/24 (AZ-b)
  - 10.0.23.0/24 (AZ-c)
```

### Security Groups

```yaml
LambdaSecurityGroup:
  Ingress: None (functions initiate outbound only)
  Egress:
    - DocumentDB: 27017
    - ElastiCache: 6379
    - HTTPS: 443 (for external APIs)

DatabaseSecurityGroup:
  Ingress:
    - From LambdaSecurityGroup: 27017 (DocumentDB)
    - From LambdaSecurityGroup: 6379 (Redis)
  Egress: None
```

---

## Data Flow

### Read Path (Get Project)

```
User → CloudFront → API Gateway → Lambda
                                    ↓
                            Check Redis Cache
                                    ↓
                        Cache Hit? Yes → Return
                                    ↓ No
                           Query DynamoDB
                                    ↓
                         Store in Redis (15min TTL)
                                    ↓
                            Return to User
```

### Write Path (Create Task)

```
User → API Gateway → Lambda (task-service)
                       ↓
              Validate & Authenticate
                       ↓
            Write to DynamoDB
                       ↓
          Publish Event (EventBridge)
                       ↓
        ┌──────────────┴──────────────┐
        ▼                              ▼
Notification Service        Analytics Service
(Send alerts)               (Update metrics)
```

---

## Scalability Strategy

### Horizontal Scaling

- **Lambda**: Concurrent executions scale automatically (up to 1000)
- **DynamoDB**: On-demand capacity, auto-scales with traffic
- **API Gateway**: Managed service, handles any load
- **CloudFront**: Global CDN, infinite edge locations

### Performance Optimization

1. **Caching Layers**:
   - CloudFront (static assets)
   - API Gateway (API responses)
   - Redis (database queries)
   - Browser (client-side)

2. **Database Optimization**:
   - DynamoDB GSIs for query patterns
   - DocumentDB read replicas
   - Connection pooling (Redis)

3. **Code Optimization**:
   - Lambda Provisioned Concurrency (for critical functions)
   - Cold start mitigation (keep functions warm)
   - Efficient packaging (layers, tree-shaking)

---

## High Availability & Disaster Recovery

### High Availability

- **Multi-AZ Deployment**: All services in 3 AZs
- **Auto-Healing**: Lambda retries, DynamoDB auto-failover
- **Health Checks**: Route 53 health checks
- **Redundancy**: Multiple NAT Gateways

### Disaster Recovery

**RTO: 4 hours | RPO: 1 hour**

- **Backup Strategy**:
  - DynamoDB: PITR + daily snapshots
  - DocumentDB: Automated backups (7 days)
  - S3: Versioning + cross-region replication
  
- **Failover**:
  - Route 53 automatic failover to secondary region
  - Warm standby Lambda functions in us-west-2
  - Data replication via DynamoDB Global Tables

---

## Cost Optimization

### Strategies

1. **Right-Sizing**: Optimize Lambda memory allocation
2. **Reserved Capacity**: For predictable workloads
3. **Lifecycle Policies**: Auto-archive old S3 data
4. **Log Retention**: Delete old CloudWatch logs
5. **On-Demand**: Use on-demand for unpredictable loads

### Monthly Cost Estimate (1000 users)

| Service | Monthly Cost |
|---------|--------------|
| Lambda | $50 |
| API Gateway | $35 |
| DynamoDB | $100 |
| DocumentDB | $200 |
| ElastiCache | $80 |
| S3 + CloudFront | $50 |
| Cognito | $15 |
| Other services | $70 |
| **Total** | **~$600** |

---

**Document Version**: 1.0.0  
**Last Updated**: November 5, 2025  
**Maintained By**: CodexFlow Architecture Team
