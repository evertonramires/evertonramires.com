FROM oven/bun:1

WORKDIR /app

# Install dependencies first for caching
COPY package.json bun.lock* bunfig.toml* tsconfig.json* ./
RUN bun install

# Copy the rest of the source
COPY . .

# Default dev port (we'll map/override in compose if needed)
EXPOSE 3000

CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "3000"]
