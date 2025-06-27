# 1. Use a base image (Node.js ka ready-made OS+Node)
FROM node:18

# 2. App ka kaam yahan hoga
WORKDIR /app

# 3. package.json ko copy karo
COPY package*.json ./

# 4. npm install chalao
RUN npm install

# 5. Baaki source code copy karo
COPY . .

# 6. App start karo
CMD ["npm", "start"]
