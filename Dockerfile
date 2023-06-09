# Use a base image with Node.js
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Set default values for environment variables using build arguments
ARG VITE_MAPBOX_TOKEN
ENV VITE_MAPBOX_TOKEN=${VITE_MAPBOX_TOKEN}
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_GOOGLE_API_KEY
ENV VITE_GOOGLE_API_KEY=${VITE_GOOGLE_API_KEY}
ARG VITE_UPLOAD_URL
ENV VITE_UPLOAD_URL=${VITE_UPLOAD_URL}

# Install dependencies
RUN npm install

# Copy the source code to the working directory
COPY . .

# Build the TypeScript app
RUN npm run build

# Use a lightweight web server image
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/configfile.template

# Copy the built app from the previous stage to the web server directory
COPY --from=builder /app/dist /usr/share/nginx/html

ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080

# Start the web server
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
