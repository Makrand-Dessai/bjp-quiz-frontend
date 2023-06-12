# base image
FROM node:18.15.0-alpine as builder

# Create and change to the app directory.
WORKDIR /app
COPY package.json .
RUN npm install .
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY . .
RUN npm run build 
# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"] 

# Copy local code to the container image.
