FROM node:18

# COPY FILES OVER
COPY src/ src/
COPY migrations/ migrations/
COPY package.json /
COPY knexfile.js /

# INSTALL NODE PACKAGES
RUN npm install

# RUN SERVER
CMD npx knex migrate:up && npm run server
