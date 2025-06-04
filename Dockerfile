# 1. Base Image
FROM node:18-buster-slim

# 2. Install Puppeteer dependencies
# We need to install dependencies for Chromium.
# Solution based on https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
RUN apt-get update && apt-get install -yq \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Create and switch to a non-root user
RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser

# 4. Set Working Directory
# All subsequent commands will be run in this directory
WORKDIR /usr/src/app

# 5. Copy package files (package.json and package-lock.json)
# This leverages Docker's cache. npm ci will only run if these files change.
COPY package*.json ./

# 6. Install dependencies
# Using npm ci for a clean install from package-lock.json
# --omit=dev to skip development dependencies for a smaller image
# We also need to ensure that Puppeteer downloads the correct Chromium browser for the Docker environment.
# PUPPETEER_SKIP_CHROMIUM_DOWNLOAD can be true if Chromium is installed via apt-get,
# but here we rely on Puppeteer's own Chromium.
# The chown command ensures the non-root user can access these files.
RUN npm ci --omit=dev \
    && chown -R pptruser:pptruser /usr/src/app

# 7. Copy application code
# Copies the rest of your application's code into the image.
COPY . .
# Ensure the non-root user owns all application files
RUN chown -R pptruser:pptruser /usr/src/app

# Switch to non-root user for security
USER pptruser

# 8. Set Default Command
# This is the command that will be run when the container starts
CMD ["node", "app.js"]
