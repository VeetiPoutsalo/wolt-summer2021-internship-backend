# --[Builder Stage]--
FROM node:14 AS builder

WORKDIR /app

# Install all dependencies
COPY *.lock .
COPY package.json .
RUN yarn install

# Copy relevant configs
COPY tsconfig.json .

# Copy source files
COPY ./src ./src

# Build source
RUN yarn build

# --[Production Stage]--
FROM node:14

WORKDIR /app

# Install all production dependencies
COPY *.lock .
COPY package.json .
RUN yarn install --prod

# Copy built files from builder stage
COPY --from=builder /app/build ./build

# Run app
ENTRYPOINT [ "yarn", "start-no-build" ]