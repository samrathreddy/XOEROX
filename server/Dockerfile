# Use an official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Install system dependencies for PDF processing (Poppler & GraphicsMagick)
RUN apt-get update && apt-get install -y \
    poppler-utils \
    graphicsmagick \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy entire backend source code
COPY . .

# Expose API port
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
