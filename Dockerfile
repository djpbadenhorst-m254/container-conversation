FROM node:18

# COPY FILES OVER
COPY src/ src/
COPY knexfile.js /
COPY package.json /
COPY migrations/ migrations/
COPY nodelib-m254-utils/ /nodelib-m254-utils

# INSTALL NODE PACKAGES
RUN npm install
RUN npm install /nodelib-m254-utils/

# RUN SERVER
CMD (npm run knex -- migrate:latest && npm run server)
