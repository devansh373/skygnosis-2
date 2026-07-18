FROM node:22-alpine

# Install openssl which is required by Prisma for some engines
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
