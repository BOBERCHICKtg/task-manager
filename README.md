<!-- GitHub Actions
Создайте файл .github/workflows/pipeline.yml:

yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Setup Node.js (пример для JavaScript)
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run tests
      run: npm test
    
    - name: Check coverage
      run: |
        npm run coverage
        # Или используйте инструмент проверки покрытия
        npx nyc --check-coverage --lines 70 npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Build Docker image
      run: |
        docker build -t my-app:${GITHUB_SHA} .
    
    - name: Run security scan (опционально)
      run: |
        docker scan my-app:${GITHUB_SHA}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    
    - name: Deploy to test server
      run: |
        # Пример деплоя - настройте под вашу инфраструктуру
        docker tag my-app:${GITHUB_SHA} localhost:5000/my-app:latest
        docker push localhost:5000/my-registry/my-app:latest
        
        # Или деплой на тестовый сервер
        ssh deploy@test-server "docker pull localhost:5000/my-app:latest && docker-compose up -d" -->
<!-- 
         GitLab CI
Создайте файл .gitlab-ci.yml:

yaml
stages:
  - test
  - build
  - deploy

variables:
  DOCKER_REGISTRY: localhost:5000
  IMAGE_NAME: my-app

test:
  stage: test
  image: node:18
  script:
    - npm install
    - npm test
    - npm run coverage
    # Проверка покрытия кода
    - npx nyc --check-coverage --lines 70 npm test
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY
  script:
    - docker build -t $DOCKER_REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA
  only:
    - main
    - develop

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no deploy@test-server "
        docker pull $DOCKER_REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA &&
        docker tag $DOCKER_REGISTRY/$IMAGE_NAME:$CI_COMMIT_SHA $IMAGE_NAME:latest &&
        docker-compose -f /path/to/your/docker-compose.yml up -d
      "
  only:
    - main -->


<!--  Пример Dockerfile
dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Экспонируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"] -->

<!-- Настройка проверки покрытия кода
Для JavaScript/Node.js добавьте в package.json:

json
{
  "scripts": {
    "test": "jest",
    "coverage": "jest --coverage",
    "check-coverage": "jest --coverage --coverageThreshold='{\"global\":{\"lines\":70}}'"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nyc": "^15.0.0"
  }
} -->
<!-- 
Настройка локального Docker Registry
bash
# Запуск локального registry
docker run -d -p 5000:5000 --name registry registry:2

# Тегирование и отправка образа
docker tag my-app:latest localhost:5000/my-app:latest
docker push localhost:5000/my-app:latest
6. Требуемые секреты (secrets)
Для GitHub Actions настройте в Settings → Secrets:

DOCKER_REGISTRY_URL

DOCKER_USERNAME

DOCKER_PASSWORD

SSH_PRIVATE_KEY (для деплоя)

Для GitLab CI в Settings → CI/CD → Variables:

CI_REGISTRY_USER

CI_REGISTRY_PASSWORD
 -->
SSH_PRIVATE_KEY