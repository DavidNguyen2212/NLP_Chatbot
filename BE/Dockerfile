# NodeJS LTS Version
FROM node:20-buster

# Set working directory
WORKDIR /usr/src/app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm config set strict-ssl false
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .


# Expose port 3000
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "dev"]
