# Stage 1: Build the application
FROM oven/bun:1 as build
WORKDIR /usr/src/app

# Copy package.json and bun.lockb
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# (Optional) If you have a build script, uncomment the following line
# RUN bun run build

# Stage 2: Create the production image
FROM oven/bun:1-slim as production
WORKDIR /usr/src/app

# Copy artifacts from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/src ./src
COPY --from=build /usr/src/app/tsconfig.json .


# Expose the port your app runs on
EXPOSE 3000

# Command to start the application
CMD ["bun", "start"]
