FROM node:22-alpine
WORKDIR /app
COPY server.js package.json index.html drug-lord-3d.html ./
ENV PORT=8080 DATA_DIR=/data
VOLUME /data
EXPOSE 8080
CMD ["node", "server.js"]
