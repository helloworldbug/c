FROM registry.gli.space:5000/nginx:alpine

ADD ./dist/ /usr/share/nginx/html/
