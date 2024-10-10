# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the application (this runs your build script, typically for TypeScript apps)
RUN npm run build

# Install PM2 globally
RUN npm install -g pm2

# Expose the port the app runs on
EXPOSE 3000

# Command to start the app using PM2
CMD ["pm2-runtime", "dist/server.js", "--watch"]

