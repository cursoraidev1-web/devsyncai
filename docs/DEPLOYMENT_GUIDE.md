# CodexFlow - Deployment Guide

> Complete guide for deploying CodexFlow to AWS

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Infrastructure Deployment](#infrastructure-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Database Setup](#database-setup)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Environment Configuration](#environment-configuration)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Monitoring Setup](#monitoring-setup)
11. [Rollback Procedures](#rollback-procedures)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

```bash
# Node.js and npm
node --version  # v18 or higher
npm --version   # v9 or higher

# AWS CLI
aws --version   # v2.x or higher

# Terraform (or AWS CDK)
terraform --version  # v1.5 or higher

# Serverless Framework
serverless --version  # v3.x or higher

# Git
git --version
```

### AWS Account Setup

1. **Create AWS Account** (if you don't have one)
2. **Create IAM User** for deployment:
   ```bash
   aws iam create-user --user-name codexflow-deployer
   ```

3. **Attach Required Policies**:
   - `AdministratorAccess` (for initial setup)
   - Or create custom policy with specific permissions

4. **Create Access Keys**:
   ```bash
   aws iam create-access-key --user-name codexflow-deployer
   ```

5. **Configure AWS CLI**:
   ```bash
   aws configure
   # Enter: Access Key ID
   # Enter: Secret Access Key
   # Enter: Default region (e.g., us-east-1)
   # Enter: Default output format (json)
   ```

### Repository Access

```bash
# Clone the repository
git clone https://github.com/your-org/codexflow.git
cd codexflow

# Install dependencies
npm install
```

---

## Environment Setup

### Environment Variables

Create environment files for each environment:

```bash
# Development
.env.development

# Staging
.env.staging

# Production
.env.production
```

### Example .env File

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Environment
NODE_ENV=production
STAGE=prod

# API Configuration
API_BASE_URL=https://api.codexflow.io/v1
FRONTEND_URL=https://app.codexflow.io

# Cognito
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Database
DYNAMODB_TABLE_PREFIX=codexflow-prod
DOCUMENTDB_URI=mongodb://username:password@cluster.region.docdb.amazonaws.com:27017
REDIS_ENDPOINT=codexflow-prod.xxxxx.0001.use1.cache.amazonaws.com:6379

# S3 Buckets
S3_BUCKET_ASSETS=codexflow-prod-assets
S3_BUCKET_UPLOADS=codexflow-prod-uploads

# API Keys (from Secrets Manager)
GITHUB_OAUTH_CLIENT_ID=from_secrets_manager
SLACK_BOT_TOKEN=from_secrets_manager

# AI/ML
SAGEMAKER_ENDPOINT=codexflow-prod-risk-analyzer
BEDROCK_MODEL_ID=anthropic.claude-v2

# Monitoring
SENTRY_DSN=https://xxxx@sentry.io/xxxxx
LOG_LEVEL=info

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_INTEGRATIONS=true
```

---

## Infrastructure Deployment

### Option 1: Terraform

#### Step 1: Initialize Terraform

```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Create workspace for environment
terraform workspace new prod
terraform workspace select prod
```

#### Step 2: Configure Variables

Create `terraform.tfvars`:

```hcl
# terraform.tfvars
aws_region          = "us-east-1"
environment         = "prod"
project_name        = "codexflow"

# VPC Configuration
vpc_cidr            = "10.0.0.0/16"
availability_zones  = ["us-east-1a", "us-east-1b", "us-east-1c"]

# DocumentDB Configuration
docdb_instance_class    = "db.r5.large"
docdb_instance_count    = 3
docdb_master_username   = "admin"

# ElastiCache Configuration
redis_node_type         = "cache.r5.large"
redis_num_cache_nodes   = 3

# Domain Configuration
domain_name             = "codexflow.io"
api_subdomain           = "api"
app_subdomain           = "app"

# Tags
tags = {
  Project     = "CodexFlow"
  Environment = "Production"
  ManagedBy   = "Terraform"
}
```

#### Step 3: Plan and Apply

```bash
# Review the execution plan
terraform plan -out=tfplan

# Apply the infrastructure
terraform apply tfplan

# Save outputs
terraform output -json > outputs.json
```

#### Step 4: Store State Remotely (Recommended)

```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "codexflow-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "codexflow-terraform-locks"
  }
}
```

### Option 2: AWS CDK

#### Step 1: Initialize CDK

```bash
cd infrastructure/cdk

# Install dependencies
npm install

# Bootstrap CDK (first time only)
cdk bootstrap aws://<ACCOUNT_ID>/us-east-1
```

#### Step 2: Deploy Stacks

```bash
# Deploy all stacks
cdk deploy --all --context environment=prod

# Or deploy specific stacks
cdk deploy CodexFlowNetworkStack --context environment=prod
cdk deploy CodexFlowDatabaseStack --context environment=prod
cdk deploy CodexFlowComputeStack --context environment=prod
```

#### Step 3: View Stack Outputs

```bash
# List stacks
cdk list

# View stack outputs
aws cloudformation describe-stacks --stack-name CodexFlowNetworkStack-prod
```

---

## Frontend Deployment

### Option 1: AWS Amplify (Recommended)

#### Step 1: Configure Amplify

```bash
cd frontend

# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init
# ? Enter a name for the project: codexflow
# ? Enter a name for the environment: prod
# ? Choose your default editor: Visual Studio Code
# ? Choose the type of app: javascript
# ? What javascript framework: react
# ? Source Directory Path: src
# ? Distribution Directory Path: .next
# ? Build Command: npm run build
# ? Start Command: npm run start
```

#### Step 2: Add Hosting

```bash
# Add hosting with Amazon CloudFront
amplify add hosting
# ? Select the plugin module: Hosting with Amplify Console
# ? Choose a type: Manual deployment
```

#### Step 3: Deploy

```bash
# Build and deploy
npm run build
amplify publish

# Or use Amplify Console for continuous deployment
# Connect to GitHub repository
# Amplify will automatically build and deploy on push
```

### Option 2: Manual Deployment (S3 + CloudFront)

#### Step 1: Build Frontend

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
# Output: .next/ or out/ directory
```

#### Step 2: Upload to S3

```bash
# Create S3 bucket
aws s3 mb s3://codexflow-frontend-prod --region us-east-1

# Enable static website hosting
aws s3 website s3://codexflow-frontend-prod \
  --index-document index.html \
  --error-document index.html

# Upload files
aws s3 sync .next/ s3://codexflow-frontend-prod/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "service-worker.js"

# Upload HTML with shorter cache
aws s3 sync .next/ s3://codexflow-frontend-prod/ \
  --cache-control "public, max-age=0, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "service-worker.js"
```

#### Step 3: Create CloudFront Distribution

```bash
# Create distribution (via Terraform or AWS Console)
# See infrastructure/terraform/cloudfront.tf

# Get distribution ID
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name CodexFlowCDN-prod \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
  --output text)

# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

---

## Backend Deployment

### Serverless Framework Deployment

#### Step 1: Configure Serverless

```yaml
# serverless.yml
service: codexflow-api
frameworkVersion: '3'

provider:
  name: aws
  runtime: nodejs18.x
  stage: ${opt:stage, 'dev'}
  region: us-east-1
  memorySize: 1024
  timeout: 30
  
  environment:
    STAGE: ${self:provider.stage}
    DYNAMODB_TABLE: ${self:custom.dynamodbTable}
    DOCUMENTDB_URI: ${ssm:/codexflow/${self:provider.stage}/documentdb/uri}
    REDIS_ENDPOINT: ${ssm:/codexflow/${self:provider.stage}/redis/endpoint}
  
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:*
            - s3:*
            - secretsmanager:GetSecretValue
            - sagemaker:InvokeEndpoint
          Resource: '*'

functions:
  # Auth service
  login:
    handler: services/auth/functions/login/index.handler
    events:
      - http:
          path: /auth/login
          method: post
          cors: true
  
  # Project service
  createProject:
    handler: services/projects/functions/create/index.handler
    events:
      - http:
          path: /projects
          method: post
          cors: true
          authorizer:
            type: COGNITO_USER_POOLS
            authorizerId: !Ref CognitoAuthorizer

plugins:
  - serverless-plugin-typescript
  - serverless-offline
  - serverless-dotenv-plugin

custom:
  dynamodbTable: codexflow-${self:provider.stage}-main
```

#### Step 2: Deploy Services

```bash
# Deploy all services
cd services

# Deploy each service
cd auth-service
serverless deploy --stage prod --region us-east-1

cd ../project-service
serverless deploy --stage prod --region us-east-1

cd ../task-service
serverless deploy --stage prod --region us-east-1

# Or deploy all at once with script
./scripts/deploy-all.sh prod
```

#### Step 3: Deploy AI Service

```bash
cd services/ai-service

# Package Python dependencies
pip install -r requirements.txt -t ./package

# Deploy
serverless deploy --stage prod
```

---

## Database Setup

### DynamoDB Tables

#### Create Tables

```bash
# Main table
aws dynamodb create-table \
  --table-name codexflow-prod-main \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --global-secondary-indexes \
    "[{\"IndexName\":\"GSI1\",\"KeySchema\":[{\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"}}]" \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

# Enable PITR
aws dynamodb update-continuous-backups \
  --table-name codexflow-prod-main \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true
```

### DocumentDB Cluster

#### Create Cluster

```bash
# Create subnet group
aws docdb create-db-subnet-group \
  --db-subnet-group-name codexflow-prod-subnet-group \
  --db-subnet-group-description "Subnet group for CodexFlow DocumentDB" \
  --subnet-ids subnet-xxxxxxxx subnet-yyyyyyyy subnet-zzzzzzzz

# Create cluster
aws docdb create-db-cluster \
  --db-cluster-identifier codexflow-prod-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password <SECURE_PASSWORD> \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name codexflow-prod-subnet-group \
  --backup-retention-period 7 \
  --preferred-backup-window 03:00-04:00

# Create instances
for i in {1..3}; do
  aws docdb create-db-instance \
    --db-instance-identifier codexflow-prod-instance-$i \
    --db-instance-class db.r5.large \
    --engine docdb \
    --db-cluster-identifier codexflow-prod-cluster
done
```

#### Initialize Database

```bash
# Connect to DocumentDB
mongo --ssl \
  --host codexflow-prod-cluster.cluster-xxxxxxx.us-east-1.docdb.amazonaws.com:27017 \
  --sslCAFile rds-combined-ca-bundle.pem \
  --username admin \
  --password <PASSWORD>

# Create database and collections
use codexflow

db.createCollection("prds")
db.createCollection("analytics")
db.createCollection("documents")

# Create indexes
db.prds.createIndex({ projectId: 1, version: -1 })
db.prds.createIndex({ approvalStatus: 1, createdAt: -1 })
db.analytics.createIndex({ projectId: 1, date: -1 })
```

### ElastiCache Redis

#### Create Cluster

```bash
# Create subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name codexflow-prod-subnet-group \
  --cache-subnet-group-description "Subnet group for CodexFlow Redis" \
  --subnet-ids subnet-xxxxxxxx subnet-yyyyyyyy

# Create replication group
aws elasticache create-replication-group \
  --replication-group-id codexflow-prod-redis \
  --replication-group-description "CodexFlow Redis Cluster" \
  --engine redis \
  --cache-node-type cache.r5.large \
  --num-cache-clusters 3 \
  --automatic-failover-enabled \
  --cache-subnet-group-name codexflow-prod-subnet-group \
  --security-group-ids sg-xxxxxxxx \
  --at-rest-encryption-enabled \
  --transit-encryption-enabled
```

---

## CI/CD Pipeline

### AWS CodePipeline Setup

#### Step 1: Create Pipeline

```yaml
# buildspec.yml
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
      - echo Installing dependencies...
      - npm install
  
  build:
    commands:
      - echo Build started on `date`
      - echo Running tests...
      - npm test
      - echo Running linter...
      - npm run lint
      - echo Building application...
      - npm run build
  
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Deploying to $STAGE environment...
      - serverless deploy --stage $STAGE --region $AWS_REGION

artifacts:
  files:
    - '**/*'
```

#### Step 2: Configure Pipeline

```bash
# Create CodePipeline
aws codepipeline create-pipeline --cli-input-json file://pipeline.json
```

```json
{
  "pipeline": {
    "name": "CodexFlow-Production",
    "roleArn": "arn:aws:iam::ACCOUNT_ID:role/CodePipeline-ServiceRole",
    "stages": [
      {
        "name": "Source",
        "actions": [
          {
            "name": "SourceAction",
            "actionTypeId": {
              "category": "Source",
              "owner": "ThirdParty",
              "provider": "GitHub",
              "version": "1"
            },
            "configuration": {
              "Owner": "your-org",
              "Repo": "codexflow",
              "Branch": "main",
              "OAuthToken": "{{resolve:secretsmanager:github-token}}"
            },
            "outputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ]
          }
        ]
      },
      {
        "name": "Build",
        "actions": [
          {
            "name": "BuildAction",
            "actionTypeId": {
              "category": "Build",
              "owner": "AWS",
              "provider": "CodeBuild",
              "version": "1"
            },
            "configuration": {
              "ProjectName": "CodexFlow-Build"
            },
            "inputArtifacts": [
              {
                "name": "SourceOutput"
              }
            ],
            "outputArtifacts": [
              {
                "name": "BuildOutput"
              }
            ]
          }
        ]
      },
      {
        "name": "Deploy",
        "actions": [
          {
            "name": "DeployAction",
            "actionTypeId": {
              "category": "Deploy",
              "owner": "AWS",
              "provider": "CloudFormation",
              "version": "1"
            },
            "configuration": {
              "ActionMode": "CREATE_UPDATE",
              "StackName": "CodexFlow-Backend-Prod",
              "TemplatePath": "BuildOutput::packaged.yaml"
            },
            "inputArtifacts": [
              {
                "name": "BuildOutput"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### GitHub Actions (Alternative)

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Run linter
        run: npm run lint
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy backend
        run: |
          cd services
          ./deploy-all.sh prod
      
      - name: Build frontend
        run: |
          cd frontend
          npm run build
      
      - name: Deploy frontend
        run: |
          aws s3 sync frontend/.next/ s3://codexflow-frontend-prod/ --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
      
      - name: Run smoke tests
        run: npm run test:smoke
```

---

## Environment Configuration

### Secrets Management

#### Store Secrets in AWS Secrets Manager

```bash
# Database credentials
aws secretsmanager create-secret \
  --name codexflow/prod/docdb/credentials \
  --secret-string '{"username":"admin","password":"SecurePassword123!"}'

# API keys
aws secretsmanager create-secret \
  --name codexflow/prod/api-keys \
  --secret-string '{"github":"ghp_xxx","slack":"xoxb-xxx"}'

# Retrieve secrets in Lambda
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({});
const response = await client.send(
  new GetSecretValueCommand({ SecretId: 'codexflow/prod/docdb/credentials' })
);
const credentials = JSON.parse(response.SecretString);
```

#### Store Configuration in Systems Manager Parameter Store

```bash
# Store configuration
aws ssm put-parameter \
  --name /codexflow/prod/api/base-url \
  --value https://api.codexflow.io/v1 \
  --type String

aws ssm put-parameter \
  --name /codexflow/prod/feature-flags/ai-enabled \
  --value true \
  --type String

# Retrieve in Lambda
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

const client = new SSMClient({});
const response = await client.send(
  new GetParameterCommand({ Name: '/codexflow/prod/api/base-url' })
);
const baseUrl = response.Parameter.Value;
```

---

## Post-Deployment Verification

### Verification Checklist

```bash
# 1. Check API health
curl https://api.codexflow.io/v1/health

# Expected: {"status":"ok","timestamp":"2025-11-05T12:00:00Z"}

# 2. Test authentication
curl -X POST https://api.codexflow.io/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# 3. Check frontend
curl https://app.codexflow.io

# 4. Verify database connections
aws dynamodb describe-table --table-name codexflow-prod-main

# 5. Check Lambda functions
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `codexflow-prod`)].FunctionName'

# 6. Verify CloudFront distribution
aws cloudfront list-distributions --query 'DistributionList.Items[?Comment==`CodexFlow Production`]'
```

### Smoke Tests

```bash
# Run automated smoke tests
npm run test:smoke:prod

# Or manual tests
./scripts/smoke-tests.sh prod
```

---

## Monitoring Setup

### CloudWatch Dashboards

```bash
# Create dashboard
aws cloudwatch put-dashboard --dashboard-name CodexFlow-Production --dashboard-body file://dashboard.json
```

### Alarms

```bash
# Create alarm for Lambda errors
aws cloudwatch put-metric-alarm \
  --alarm-name codexflow-prod-lambda-errors \
  --alarm-description "Alert on Lambda errors" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:codexflow-alerts

# Create alarm for API latency
aws cloudwatch put-metric-alarm \
  --alarm-name codexflow-prod-api-latency \
  --alarm-description "Alert on high API latency" \
  --metric-name Latency \
  --namespace AWS/ApiGateway \
  --statistic Average \
  --period 300 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:codexflow-alerts
```

---

## Rollback Procedures

### Backend Rollback

```bash
# List deployments
serverless deploy list --stage prod

# Rollback to previous version
serverless rollback --timestamp <TIMESTAMP> --stage prod

# Or use AWS Lambda versioning
aws lambda update-alias \
  --function-name codexflow-prod-createProject \
  --name prod \
  --function-version <PREVIOUS_VERSION>
```

### Frontend Rollback

```bash
# Rollback S3 objects
aws s3 sync s3://codexflow-frontend-prod-backup/ s3://codexflow-frontend-prod/ --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

### Database Rollback

```bash
# DynamoDB: Restore from Point-in-Time
aws dynamodb restore-table-to-point-in-time \
  --source-table-name codexflow-prod-main \
  --target-table-name codexflow-prod-main-restored \
  --restore-date-time 2025-11-05T10:00:00Z

# DocumentDB: Restore from snapshot
aws docdb restore-db-cluster-from-snapshot \
  --db-cluster-identifier codexflow-prod-cluster-restored \
  --snapshot-identifier codexflow-prod-snapshot-20251105 \
  --engine docdb
```

---

## Troubleshooting

### Common Issues

#### 1. Lambda Timeout

**Symptom**: Lambda functions timing out

**Solution**:
```bash
# Increase timeout
aws lambda update-function-configuration \
  --function-name codexflow-prod-createProject \
  --timeout 60

# Or increase memory (which also increases CPU)
aws lambda update-function-configuration \
  --function-name codexflow-prod-createProject \
  --memory-size 2048
```

#### 2. Database Connection Issues

**Symptom**: Cannot connect to DocumentDB/Redis

**Solution**:
```bash
# Check security group rules
aws ec2 describe-security-groups --group-ids sg-xxxxxxxx

# Verify Lambda is in VPC
aws lambda get-function-configuration --function-name codexflow-prod-createProject

# Test connection from Lambda
aws lambda invoke \
  --function-name codexflow-prod-test-connection \
  response.json
```

#### 3. High Costs

**Symptom**: Unexpected AWS bills

**Solution**:
```bash
# Check cost breakdown
aws ce get-cost-and-usage \
  --time-period Start=2025-11-01,End=2025-11-30 \
  --granularity DAILY \
  --metrics BlendedCost \
  --group-by Type=SERVICE

# Optimize:
# - Right-size Lambda memory
# - Enable DynamoDB auto-scaling
# - Set S3 lifecycle policies
# - Use Reserved Capacity for predictable workloads
```

---

**Document Version**: 1.0.0  
**Last Updated**: November 5, 2025  
**Maintained By**: CodexFlow DevOps Team
