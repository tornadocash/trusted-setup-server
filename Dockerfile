FROM node:11
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install && npm cache clean --force
COPY . .

EXPOSE 3000
HEALTHCHECK CMD curl -f http://localhost:3000/
CMD ["npm", "run", "start"]
