FROM tornadocash/phase2-bn254 as bin

FROM node:12-buster
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean --force
COPY . .

COPY --from=bin /usr/bin/phase2_verify_contribution /app/server/bin/

EXPOSE 3000
HEALTHCHECK CMD curl -f http://localhost:3000/
RUN yarn build
CMD ["yarn", "start"]
