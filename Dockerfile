FROM node

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

# RUN yarn build

# FROM node:latest

# # COPY --from=builder /app/node_modules ./node_modules
# # COPY --from=builder /app/package*.json ./
# # COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["yarn", "start:dev"]