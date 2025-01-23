FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Expose the Vite dev server port (default: 5173)
EXPOSE 5173

# Start Vite dev server with explicit host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
