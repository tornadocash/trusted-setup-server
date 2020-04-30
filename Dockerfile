FROM tornadocash/phase2-bn254:phase2 as bin

FROM node:12-buster
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean --force
COPY . .

COPY --from=bin /usr/bin/verify_contribution /app/server/bin/
COPY --from=bin /wasm/* /app/lib/phase2/
COPY --from=bin /wasm/phase2_bg.wasm /app/static/_nuxt/lib/phase2/

EXPOSE 3000
HEALTHCHECK CMD curl -f http://localhost:3000/
CMD ["yarn", "start"]
