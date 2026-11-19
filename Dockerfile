FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=8080 STATIC_DIR=/app/dist
WORKDIR /app
COPY --from=build /app/server.js ./server.js
COPY --from=build /app/dist ./dist
USER node
EXPOSE 8080
CMD ["node", "server.js"]
