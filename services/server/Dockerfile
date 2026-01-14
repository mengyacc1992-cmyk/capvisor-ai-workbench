FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY tsconfig.json ./tsconfig.json
COPY src ./src
# Copy shared types
COPY ../types.ts ./types.ts
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/package.json /app/package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY --from=build /app/dist ./dist
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]

