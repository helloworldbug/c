FROM registry.gli.space:5000/mepc_node:latest

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /mepc

ENTRYPOINT /entrypoint.sh
CMD ["serve"]

VOLUME ["/mepc"]
