FROM node:20-alpine

RUN apk add --update --no-cache git \
                                libzmq \
                                zeromq-dev \
                                python3 \
                                make \
                                g++

WORKDIR /insight

# Pinned so a rebuild cannot pick up an untested dashcore-node or insight-api.
# Both need dashcore-lib 0.26 or later to read Dash Core v24 blocks.
ARG DASHCORE_NODE_REF=v7.0.6
ARG INSIGHT_API_SPEC=@dashevo/insight-api@4.0.9

# Copy dashcore-node
RUN git clone --branch ${DASHCORE_NODE_REF} --single-branch --depth 1 https://github.com/dashpay/dashcore-node.git .

# Copy config file
COPY dashcore-node.json .

# Install NPM modules
RUN npm ci

ARG VERSION

# Install Insight modules
RUN bin/dashcore-node install ${INSIGHT_API_SPEC}
RUN bin/dashcore-node install @dashevo/insight-ui@${VERSION}

FROM node:20-alpine

LABEL maintainer="Dash Developers <dev@dash.org>"
LABEL description="Dockerised Insight-Dash"

WORKDIR /insight

# Copy project files
COPY --from=0 /insight/ .

EXPOSE 3001

CMD ["bin/dashcore-node", "start"]
