# Use a lightweight Node.js base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY ./src ./src
COPY tsconfig.json ./

# Compile TypeScript to JavaScript
RUN npx tsc -p .

# Expose the application port
EXPOSE 8001

# Run the server
CMD ["node", "./dist/app.js"]

