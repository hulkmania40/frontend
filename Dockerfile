# Use an official Node.js image as the base
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use an official nginx image to serve the build
FROM nginx:stable-alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80 to access the app
EXPOSE 80

# Command to run the app
CMD ["nginx", "-g", "daemon off;"]
