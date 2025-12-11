# CI/CD Integration Examples for SonarQube

This document provides ready-to-use CI/CD pipeline configurations for integrating SonarQube security scanning across different platforms.

---

## Table of Contents

- [GitLab CI/CD](#gitlab-cicd)
- [GitHub Actions](#github-actions)
- [Jenkins](#jenkins)
- [Azure DevOps](#azure-devops)
- [CircleCI](#circleci)
- [Bitbucket Pipelines](#bitbucket-pipelines)
- [AWS CodePipeline](#aws-codepipeline)
- [Google Cloud Build](#google-cloud-build)

---

## GitLab CI/CD

### Basic Pipeline with SonarQube

```yaml
# .gitlab-ci.yml

stages:
  - build
  - test
  - sonarqube
  - security-gate
  - deploy

variables:
  SONAR_HOST_URL: "https://sonarqube.example.com"
  SONAR_PROJECT_KEY: "$CI_PROJECT_PATH_SLUG"

# Build stage
build:
  stage: build
  script:
    - echo "Building application..."
    - npm install  # or mvn clean install, pip install -r requirements.txt
    - npm run build
  artifacts:
    paths:
      - dist/
      - node_modules/

# Test stage with coverage
test:
  stage: test
  script:
    - npm run test -- --coverage
  coverage: '/Statements\s*:\s*([^%]+)/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    paths:
      - coverage/

# SonarQube analysis
sonarqube-scan:
  stage: sonarqube
  image: sonarsource/sonar-scanner-cli:latest
  variables:
    SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
    GIT_DEPTH: "0"  # Tells git to fetch all the history
  cache:
    key: "${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  script:
    - sonar-scanner 
        -Dsonar.projectKey=${SONAR_PROJECT_KEY}
        -Dsonar.sources=.
        -Dsonar.host.url=${SONAR_HOST_URL}
        -Dsonar.login=${SONAR_TOKEN}
        -Dsonar.qualitygate.wait=true
        -Dsonar.qualitygate.timeout=300
  allow_failure: false
  only:
    - merge_requests
    - main
    - develop

# Quality gate check (optional separate stage)
quality-gate:
  stage: security-gate
  image: curlimages/curl:latest
  script:
    - |
      STATUS=$(curl -s -u ${SONAR_TOKEN}: \
        "${SONAR_HOST_URL}/api/qualitygate/project_status?projectKey=${SONAR_PROJECT_KEY}" \
        | grep -Po '"status":"\K[^"]*')
      echo "Quality Gate Status: ${STATUS}"
      if [ "${STATUS}" != "OK" ]; then
        echo "Quality Gate Failed!"
        exit 1
      fi
  only:
    - merge_requests
    - main
```

### Language-Specific Examples

#### Java/Maven
```yaml
sonarqube-maven:
  stage: sonarqube
  image: maven:3.8-openjdk-11
  script:
    - mvn clean verify sonar:sonar 
        -Dsonar.projectKey=${SONAR_PROJECT_KEY}
        -Dsonar.host.url=${SONAR_HOST_URL}
        -Dsonar.login=${SONAR_TOKEN}
        -Dsonar.qualitygate.wait=true
```

#### Python
```yaml
sonarqube-python:
  stage: sonarqube
  image: sonarsource/sonar-scanner-cli:latest
  before_script:
    - pip install pytest pytest-cov
    - pytest --cov=src --cov-report=xml:coverage.xml
  script:
    - sonar-scanner
        -Dsonar.projectKey=${SONAR_PROJECT_KEY}
        -Dsonar.sources=src
        -Dsonar.tests=tests
        -Dsonar.python.coverage.reportPaths=coverage.xml
        -Dsonar.host.url=${SONAR_HOST_URL}
        -Dsonar.login=${SONAR_TOKEN}
```

#### Go
```yaml
sonarqube-go:
  stage: sonarqube
  image: sonarsource/sonar-scanner-cli:latest
  before_script:
    - go test ./... -coverprofile=coverage.out
  script:
    - sonar-scanner
        -Dsonar.projectKey=${SONAR_PROJECT_KEY}
        -Dsonar.sources=.
        -Dsonar.exclusions=**/*_test.go,**/vendor/**
        -Dsonar.tests=.
        -Dsonar.test.inclusions=**/*_test.go
        -Dsonar.go.coverage.reportPaths=coverage.out
        -Dsonar.host.url=${SONAR_HOST_URL}
        -Dsonar.login=${SONAR_TOKEN}
```

---

## GitHub Actions

### Basic Workflow

```yaml
# .github/workflows/sonarqube.yml

name: SonarQube Security Scan

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Shallow clones should be disabled
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test -- --coverage
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
        with:
          args: >
            -Dsonar.projectKey=${{ github.repository }}
            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
      
      - name: SonarQube Quality Gate Check
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Multi-Language Project

```yaml
name: Multi-Language SonarQube Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      # Backend (Java)
      - name: Set up JDK 11
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
      
      - name: Build and test backend
        run: |
          cd backend
          mvn clean verify
      
      # Frontend (Node.js)
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build and test frontend
        run: |
          cd frontend
          npm ci
          npm run test -- --coverage
      
      # SonarQube Scan
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
        with:
          args: >
            -Dsonar.projectKey=${{ github.repository }}
            -Dsonar.sources=backend/src,frontend/src
            -Dsonar.tests=backend/src/test,frontend/src/__tests__
            -Dsonar.java.binaries=backend/target/classes
            -Dsonar.javascript.lcov.reportPaths=frontend/coverage/lcov.info
      
      - name: Quality Gate
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## Jenkins

### Declarative Pipeline

```groovy
// Jenkinsfile

pipeline {
    agent any
    
    environment {
        SONAR_HOST_URL = 'https://sonarqube.example.com'
        SONAR_PROJECT_KEY = "${env.JOB_NAME}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    sh 'npm run test -- --coverage'
                }
            }
            post {
                always {
                    junit 'test-results/**/*.xml'
                    publishCoverage adapters: [
                        coberturaAdapter('coverage/cobertura-coverage.xml')
                    ]
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarQube Scanner'
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=${SONAR_HOST_URL} \
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        """
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application...'
                // Add deployment steps
            }
        }
    }
    
    post {
        failure {
            emailext(
                subject: "Pipeline Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Quality Gate failed. Check SonarQube: ${SONAR_HOST_URL}",
                to: "team@example.com"
            )
        }
    }
}
```

### Maven Project Pipeline

```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8.6'
        jdk 'JDK 11'
    }
    
    stages {
        stage('Build & Test') {
            steps {
                sh 'mvn clean verify'
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        mvn sonar:sonar \
                        -Dsonar.projectKey=${JOB_NAME} \
                        -Dsonar.host.url=${SONAR_HOST_URL}
                    '''
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }
}
```

---

## Azure DevOps

### Azure Pipeline YAML

```yaml
# azure-pipelines.yml

trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  - group: sonarqube-credentials
  - name: sonarProjectKey
    value: '$(Build.Repository.Name)'

stages:
  - stage: Build
    jobs:
      - job: BuildAndTest
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: '18.x'
            displayName: 'Install Node.js'
          
          - script: |
              npm ci
              npm run build
            displayName: 'Build application'
          
          - script: |
              npm run test -- --coverage
            displayName: 'Run tests with coverage'
          
          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/test-results.xml'
            displayName: 'Publish test results'
          
          - task: PublishCodeCoverageResults@1
            inputs:
              codeCoverageTool: 'Cobertura'
              summaryFileLocation: '$(System.DefaultWorkingDirectory)/coverage/cobertura-coverage.xml'
            displayName: 'Publish coverage results'

  - stage: SonarQube
    dependsOn: Build
    jobs:
      - job: SonarQubeAnalysis
        steps:
          - task: SonarQubePrepare@5
            inputs:
              SonarQube: 'SonarQube Connection'
              scannerMode: 'CLI'
              configMode: 'manual'
              cliProjectKey: '$(sonarProjectKey)'
              cliProjectName: '$(Build.Repository.Name)'
              cliSources: 'src'
              extraProperties: |
                sonar.javascript.lcov.reportPaths=coverage/lcov.info
                sonar.qualitygate.wait=true
          
          - task: SonarQubeAnalyze@5
            displayName: 'Run SonarQube analysis'
          
          - task: SonarQubePublish@5
            inputs:
              pollingTimeoutSec: '300'
            displayName: 'Publish Quality Gate Result'

  - stage: Deploy
    dependsOn: SonarQube
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployProduction
        environment: 'production'
        strategy:
          runOnce:
            deploy:
              steps:
                - script: echo "Deploying to production..."
                  displayName: 'Deploy application'
```

---

## CircleCI

### Configuration

```yaml
# .circleci/config.yml

version: 2.1

orbs:
  sonarcloud: sonarsource/sonarcloud@1.1.1
  node: circleci/node@5.0.0

jobs:
  build-and-test:
    docker:
      - image: cimg/node:18.0
    steps:
      - checkout
      - node/install-packages
      - run:
          name: Run tests with coverage
          command: npm run test -- --coverage
      - persist_to_workspace:
          root: .
          paths:
            - coverage

  sonarqube-scan:
    docker:
      - image: sonarsource/sonar-scanner-cli:latest
    steps:
      - checkout
      - attach_workspace:
          at: .
      - run:
          name: SonarQube Scan
          command: |
            sonar-scanner \
              -Dsonar.projectKey=${CIRCLE_PROJECT_REPONAME} \
              -Dsonar.organization=${SONAR_ORGANIZATION} \
              -Dsonar.sources=. \
              -Dsonar.host.url=${SONAR_HOST_URL} \
              -Dsonar.login=${SONAR_TOKEN} \
              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
              -Dsonar.qualitygate.wait=true

workflows:
  version: 2
  build-test-scan:
    jobs:
      - build-and-test
      - sonarqube-scan:
          requires:
            - build-and-test
          filters:
            branches:
              only:
                - main
                - develop
```

---

## Bitbucket Pipelines

### Configuration

```yaml
# bitbucket-pipelines.yml

image: node:18

definitions:
  caches:
    sonar: ~/.sonar/cache
  
  steps:
    - step: &build-test
        name: Build and Test
        caches:
          - node
        script:
          - npm ci
          - npm run build
          - npm run test -- --coverage
        artifacts:
          - coverage/**
          - dist/**
    
    - step: &sonarqube-scan
        name: SonarQube Security Scan
        image: sonarsource/sonar-scanner-cli:latest
        caches:
          - sonar
        script:
          - sonar-scanner
              -Dsonar.projectKey=$BITBUCKET_REPO_SLUG
              -Dsonar.sources=.
              -Dsonar.host.url=$SONAR_HOST_URL
              -Dsonar.login=$SONAR_TOKEN
              -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
              -Dsonar.qualitygate.wait=true

pipelines:
  default:
    - step: *build-test
    - step: *sonarqube-scan
  
  branches:
    main:
      - step: *build-test
      - step: *sonarqube-scan
      - step:
          name: Deploy to Production
          deployment: production
          script:
            - echo "Deploying to production"
    
    develop:
      - step: *build-test
      - step: *sonarqube-scan
  
  pull-requests:
    '**':
      - step: *build-test
      - step: *sonarqube-scan
```

---

## AWS CodePipeline

### CloudFormation Template

```yaml
# codepipeline-sonarqube.yaml

AWSTemplateFormatVersion: '2010-09-09'
Description: 'CodePipeline with SonarQube Integration'

Resources:
  CodeBuildProject:
    Type: AWS::CodeBuild::Project
    Properties:
      Name: !Sub '${AWS::StackName}-build'
      ServiceRole: !GetAtt CodeBuildRole.Arn
      Artifacts:
        Type: CODEPIPELINE
      Environment:
        Type: LINUX_CONTAINER
        ComputeType: BUILD_GENERAL1_SMALL
        Image: aws/codebuild/standard:5.0
        EnvironmentVariables:
          - Name: SONAR_HOST_URL
            Type: PARAMETER_STORE
            Value: /sonarqube/host_url
          - Name: SONAR_TOKEN
            Type: PARAMETER_STORE
            Value: /sonarqube/token
      Source:
        Type: CODEPIPELINE
        BuildSpec: |
          version: 0.2
          phases:
            install:
              runtime-versions:
                nodejs: 18
              commands:
                - npm install -g sonarqube-scanner
            pre_build:
              commands:
                - npm ci
            build:
              commands:
                - npm run build
                - npm run test -- --coverage
            post_build:
              commands:
                - |
                  sonar-scanner \
                    -Dsonar.projectKey=${CODEBUILD_INITIATOR#codepipeline/} \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=${SONAR_HOST_URL} \
                    -Dsonar.login=${SONAR_TOKEN} \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                    -Dsonar.qualitygate.wait=true
          artifacts:
            files:
              - '**/*'
```

### buildspec.yml

```yaml
# buildspec.yml

version: 0.2

env:
  parameter-store:
    SONAR_HOST_URL: /sonarqube/host_url
    SONAR_TOKEN: /sonarqube/token

phases:
  install:
    runtime-versions:
      nodejs: 18
    commands:
      - echo "Installing dependencies..."
      - npm install -g sonarqube-scanner
      - npm ci

  pre_build:
    commands:
      - echo "Running tests..."
      - npm run test -- --coverage

  build:
    commands:
      - echo "Building application..."
      - npm run build

  post_build:
    commands:
      - echo "Running SonarQube analysis..."
      - |
        sonar-scanner \
          -Dsonar.projectKey=my-project \
          -Dsonar.sources=src \
          -Dsonar.tests=tests \
          -Dsonar.host.url=${SONAR_HOST_URL} \
          -Dsonar.login=${SONAR_TOKEN} \
          -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
          -Dsonar.qualitygate.wait=true
      - |
        STATUS=$(curl -s -u ${SONAR_TOKEN}: \
          "${SONAR_HOST_URL}/api/qualitygate/project_status?projectKey=my-project" \
          | jq -r '.projectStatus.status')
        if [ "${STATUS}" != "OK" ]; then
          echo "Quality Gate Failed!"
          exit 1
        fi

artifacts:
  files:
    - '**/*'
  name: BuildArtifact

cache:
  paths:
    - 'node_modules/**/*'
    - '.sonar/**/*'
```

---

## Google Cloud Build

### Configuration

```yaml
# cloudbuild.yaml

steps:
  # Install dependencies
  - name: 'gcr.io/cloud-builders/npm'
    args: ['ci']
    id: 'install-deps'

  # Run tests with coverage
  - name: 'gcr.io/cloud-builders/npm'
    args: ['run', 'test', '--', '--coverage']
    id: 'run-tests'
    waitFor: ['install-deps']

  # Build application
  - name: 'gcr.io/cloud-builders/npm'
    args: ['run', 'build']
    id: 'build'
    waitFor: ['install-deps']

  # SonarQube analysis
  - name: 'gcr.io/$PROJECT_ID/sonar-scanner:latest'
    args:
      - '-Dsonar.projectKey=${_PROJECT_KEY}'
      - '-Dsonar.sources=src'
      - '-Dsonar.tests=tests'
      - '-Dsonar.host.url=${_SONAR_HOST_URL}'
      - '-Dsonar.login=${_SONAR_TOKEN}'
      - '-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'
      - '-Dsonar.qualitygate.wait=true'
    id: 'sonarqube-scan'
    waitFor: ['run-tests', 'build']

  # Check quality gate (optional explicit check)
  - name: 'gcr.io/cloud-builders/curl'
    args:
      - '-s'
      - '-u'
      - '${_SONAR_TOKEN}:'
      - '${_SONAR_HOST_URL}/api/qualitygate/project_status?projectKey=${_PROJECT_KEY}'
    id: 'quality-gate-check'
    waitFor: ['sonarqube-scan']

substitutions:
  _SONAR_HOST_URL: 'https://sonarqube.example.com'
  _PROJECT_KEY: 'my-project'
  _SONAR_TOKEN: 'your-token-here'  # Use Secret Manager in production

options:
  machineType: 'N1_HIGHCPU_8'
  logging: CLOUD_LOGGING_ONLY

timeout: '1800s'
```

### Using Secret Manager

```yaml
# cloudbuild-with-secrets.yaml

availableSecrets:
  secretManager:
    - versionName: projects/$PROJECT_ID/secrets/sonar-token/versions/latest
      env: 'SONAR_TOKEN'

steps:
  - name: 'gcr.io/cloud-builders/npm'
    args: ['ci']

  - name: 'gcr.io/cloud-builders/npm'
    args: ['run', 'test', '--', '--coverage']

  - name: 'gcr.io/$PROJECT_ID/sonar-scanner:latest'
    secretEnv: ['SONAR_TOKEN']
    args:
      - '-Dsonar.projectKey=my-project'
      - '-Dsonar.sources=src'
      - '-Dsonar.host.url=https://sonarqube.example.com'
      - '-Dsonar.login=$$SONAR_TOKEN'
      - '-Dsonar.javascript.lcov.reportPaths=coverage/lcov.info'
      - '-Dsonar.qualitygate.wait=true'
```

---

## Configuration Tips

### Environment Variables

Store these securely in your CI/CD platform:

```bash
SONAR_HOST_URL=https://sonarqube.example.com
SONAR_TOKEN=your_secure_token_here
SONAR_ORGANIZATION=your-org  # For SonarCloud
```

### Quality Gate Webhook (Optional)

Configure webhook in SonarQube:
- URL: `https://your-ci-server.com/sonarqube-webhook`
- Secret: Generate and store securely
- Events: Quality Gate status changed

### Branch-Specific Analysis

```yaml
# Example for GitLab
sonarqube-scan:
  script:
    - |
      if [ "$CI_COMMIT_BRANCH" == "main" ]; then
        EXTRA_ARGS="-Dsonar.branch.name=main"
      elif [ -n "$CI_MERGE_REQUEST_IID" ]; then
        EXTRA_ARGS="
          -Dsonar.pullrequest.key=$CI_MERGE_REQUEST_IID
          -Dsonar.pullrequest.branch=$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME
          -Dsonar.pullrequest.base=$CI_MERGE_REQUEST_TARGET_BRANCH_NAME
        "
      fi
      sonar-scanner $EXTRA_ARGS
```

### Caching for Performance

```yaml
# GitLab example
cache:
  key: "${CI_JOB_NAME}"
  paths:
    - .sonar/cache
    - node_modules/

# GitHub Actions example
- uses: actions/cache@v3
  with:
    path: ~/.sonar/cache
    key: ${{ runner.os }}-sonar
    restore-keys: ${{ runner.os }}-sonar
```

---

## Troubleshooting

### Common Issues

1. **Quality Gate Timeout**
   ```yaml
   # Increase timeout
   -Dsonar.qualitygate.timeout=600
   ```

2. **Coverage Not Detected**
   ```yaml
   # Ensure correct path
   -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
   -Dsonar.python.coverage.reportPaths=coverage.xml
   ```

3. **Authentication Failures**
   - Verify SONAR_TOKEN is valid
   - Check token permissions in SonarQube
   - Ensure token is not expired

4. **Branch Analysis Not Working**
   - Enable branch analysis in SonarQube (Developer Edition+)
   - Set `GIT_DEPTH: 0` for full git history

---

## Best Practices

1. **Run SonarQube After Tests**
   - Ensures coverage data is available
   - Provides complete analysis

2. **Fail Fast on Quality Gate**
   - Set `allow_failure: false`
   - Prevents merging insecure code

3. **Cache SonarQube Data**
   - Speeds up subsequent scans
   - Reduces CI/CD time

4. **Use Separate Stages**
   - Build → Test → Scan → Deploy
   - Clear separation of concerns

5. **Monitor Performance**
   - Track scan duration
   - Optimize for large projects
   - Use incremental analysis where available

---

For more information, refer to:
- [SECURITY_POLICY.md](SECURITY_POLICY.md)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- Your CI/CD platform's documentation

**Last Updated:** December 11, 2025
