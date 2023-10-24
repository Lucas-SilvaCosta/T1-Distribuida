FROM node:16.13.0

RUN mkdir -p /usr/share/man/man1 /usr/share/man/man2
RUN apt-get update && \
        apt-get install -y --no-install-recommends \
        openjdk-11-jdk
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
RUN export JAVA_HOME 
ENV PATH="$JAVA_HOME/bin:${PATH}" 

WORKDIR /usr/src/
COPY package*.json ./
RUN npm install --save-global
WORKDIR /usr/src/api/
COPY . .
EXPOSE 8080
CMD ["npm", "start"]