# Eigener PeerJS-Vermittlungsserver für den Multiplayer (nur Verbindungsaufbau; Spieldaten laufen P2P)
FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
ENV PORT=9000
EXPOSE 9000
CMD ["npm", "start"]
