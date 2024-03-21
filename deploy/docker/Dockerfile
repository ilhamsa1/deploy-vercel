# BUILDER IMAGE
ARG BUILDER_IMAGE="node:alpine"
FROM ${BUILDER_IMAGE} as builder
RUN apk --no-cache add ca-certificates \
  && update-ca-certificates
WORKDIR /app
COPY . ./
RUN npm ci --no-fund --no-audit --prefer-offline --silent
RUN npx next telemetry disable
ENV NODE_ENV=production

# BUILD ADMIN
FROM builder as builder-admin
RUN npx nx run admin:build

# BUILD PORTAL
FROM builder as builder-portal
RUN npx nx run portal:build

# PROD IMAGE
FROM ${BUILDER_IMAGE} as prod
RUN addgroup --system --gid 1001 nodejs
WORKDIR "/app"
RUN chown nobody /app

# ADMIN
FROM prod as admin
COPY --from=builder-admin --chown=nobody:nodejs /app/dist/apps/admin/.next/standalone ./
USER nobody
CMD ["node", "apps/admin/server.js"]

# PORTAL
FROM prod as portal
COPY --from=builder-portal --chown=nobody:nodejs /app/dist/apps/portal/.next/standalone ./
USER nobody
CMD ["node", "apps/portal/server.js"]
