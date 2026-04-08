# Stage 1: Build the Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build for production
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy the compiled app from the build stage
# NOTE: Check your 'dist' folder name in angular.json (e.g., dist/autolog-frontend/browser)
COPY --from=build /app/dist/autolog-frontend/browser .

# Copy custom Nginx configuration and the entrypoint script
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Ensure the entrypoint script is executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80
EXPOSE 80

# Execute the entrypoint script to inject the API URL at runtime
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
