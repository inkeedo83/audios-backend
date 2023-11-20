# Use the official Node.js image as the base image
FROM node:20 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 5010

# Start the application
CMD ["yarn", "start"]
