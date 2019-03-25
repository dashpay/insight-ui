FROM node:8-alpine

LABEL maintainer="Dash Developers <dev@dash.org>"
LABEL description="Dockerised Insight-Dash"

RUN apk add --update --no-cache git \
                                libzmq \
                                zeromq-dev \
                                python \
                                make \
                                g++

WORKDIR /insight

RUN git clone https://github.com/dashevo/dashcore-node.git /insight

# copy config file
COPY dashcore-node.json /insight/dashcore-node.json

ARG VERSION
ARG MAJOR_VERSION

# install
RUN npm i --save

RUN /insight/bin/dashcore-node install @dashevo/insight-api@${MAJOR_VERSION}
RUN /insight/bin/dashcore-node install @dashevo/insight-ui@${VERSION}

EXPOSE 3001

CMD ["/insight/bin/dashcore-node", "start"]
