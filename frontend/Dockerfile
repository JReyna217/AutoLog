# Stage 1: Build the Angular 20 app
FROM node:22-alpine AS build
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
# Double-check if your output path is still dist/autolog-frontend/browser
COPY --from=build /app/dist/frontend/browser .

# Copy custom Nginx configuration and the entrypoint script
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Ensure the entrypoint script is executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose port 80
EXPOSE 80

# Execute the entrypoint script to inject the API URL at runtime
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]