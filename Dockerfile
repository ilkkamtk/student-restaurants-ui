# Use a base image with Node.js
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

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
