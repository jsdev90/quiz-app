FROM node:18-alpine
# ------------------------
# Install Dependencies
# ------------------------
RUN apk add --no-cache \
    curl bash ca-certificates openssl gnupg tar su-exec tzdata libc6-compat
# ------------------------
# Install glibc for MongoDB
# ------------------------
ENV GLIBC_VERSION=2.35-r1
RUN curl -sSL https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub -o /etc/apk/keys/sgerrand.rsa.pub && \
    curl -sSL https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk -o /glibc.apk && \
    apk add /glibc.apk && rm /glibc.apk
# ------------------------
# Install MongoDB manually
# ------------------------
ENV MONGO_VERSION=6.0.6
RUN curl -sSL https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2204-${MONGO_VERSION}.tgz -o mongo.tgz && \
    tar -xzf mongo.tgz && \
    mv mongodb-linux-x86_64-ubuntu2204-${MONGO_VERSION} /opt/mongodb && \
    ln -s /opt/mongodb/bin/* /usr/local/bin/ && \
    rm mongo.tgz
# ------------------------
# Prepare MongoDB data dir
# ------------------------
RUN mkdir -p /data/db /backend
# ------------------------
# Setup Node.js App
# ------------------------
WORKDIR /backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# ------------------------
# Expose ports
# ------------------------
EXPOSE 4000 27017
# ------------------------
# Start MongoDB, wait for it, then run backend
# ------------------------
CMD mongod --dbpath /data/db --fork --logpath /var/log/mongod.log && \
    echo "Waiting for MongoDB to be ready..." && \
    until mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do \
        sleep 1; \
    done && \
    echo "MongoDB is up. Starting backend..." && \
    node dist/index.js