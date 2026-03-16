FROM node:20-alpine

RUN apk add --no-cache ffmpeg python3 py3-pip curl make g++

RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps --ignore-scripts
COPY . .

CMD ["node", "index.js"]
