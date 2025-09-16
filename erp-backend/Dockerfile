# Development Dockerfile for NestJS Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Fix SSL certificate issues on Windows
RUN npm config set strict-ssl false

# Install dependencies with verbose logging
RUN npm install --force --loglevel verbose

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["npm", "run", "start:dev"]