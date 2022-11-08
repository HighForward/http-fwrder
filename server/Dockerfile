FROM node:16

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 80
ENV HOST 0.0.0.0

CMD [ "npm", "run", "start:dev" ]

#docker run -d --name pt_docker -p 80:80 proxytunnel