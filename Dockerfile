FROM node:6-slim

LABEL maintainer "Apipol Niyomsak"

ENV DEPLOY_DIR=/var/www/modcolle-port \
    DEPLOY_PORT=5000 \
    FLEX_DIR=/tmp/flex-sdk \
    FFDEC_DIR=/tmp/ffdec \

    # == System configured env ==
    # User of this system
    USER=www \
    # xvfb arguments required to start xvfb as a service successfully
    DISPLAY=:99

ADD . $DEPLOY_DIR

# install FFDec with -importScript support
RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list && \
    apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886 && \
    echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections && \
    echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections && \
    apt-get update && \
    apt-get install -y \
      # required by Adobe Flash Player
      libnss3 \
      libgtk2.0-0 \
      xvfb \

      # required by JRE
      libxtst6 \
      oracle-java8-installer \
      oracle-java8-set-default \

      # require to deploy this app
      wget \
      unzip \
      python && \
    mkdir -p \
      $FLEX_DIR \
      $FFDEC_DIR && \

    # Install Adobe Flash Player
    wget -O- https://fpdownload.macromedia.com/pub/flashplayer/updaters/25/flash_player_sa_linux.x86_64.tar.gz | tar xvz -C $DEPLOY_DIR/bin/ && \

    # Install FFDec
    wget https://github.com/jindrapetrik/jpexs-decompiler/releases/download/version10.0.0/ffdec_10.0.0.zip -O /tmp/ffdec_10.0.0.zip && \
    unzip /tmp/ffdec_10.0.0.zip -d $FFDEC_DIR && \
    rm /tmp/ffdec_10.0.0.zip && \
    wget -q https://fpdownload.macromedia.com/get/flashplayer/updaters/25/playerglobal25_0.swc -O /tmp/playerglobal25_0.swc && \

    # Configure FFDec
    cp -r $DEPLOY_DIR/.FFDec /root && \

    # Configure Adobe Flash
    cp -r $DEPLOY_DIR/.macromedia /root && \

    # Configure xvfb to run as a service
    cp $DEPLOY_DIR/build/xvfb /etc/init.d/xvfb && \
    chmod +x /etc/init.d/xvfb && \
    update-rc.d xvfb defaults 99 && \

    # Inject modcolle's actionscript code to Core.swf
    wget http://203.104.209.71/kcs/Core.swf -O /tmp/Core.swf && \
    python $DEPLOY_DIR/build/core-decode.py /tmp/Core.swf /tmp/decoded.swf && \
    java -jar $FFDEC_DIR/ffdec.jar -decompress /tmp/decoded.swf /tmp/decoded-decompressed.swf && \
    java -jar $FFDEC_DIR/ffdec.jar -importScript /tmp/decoded-decompressed.swf $DEPLOY_DIR/bin/Core.swf $DEPLOY_DIR/build/as3-import && \
    rm /tmp/*.swf && \

    # Clean up
    apt-get purge -y wget git unzip && \
    apt-get clean && \

    # Create user
    # use home directory as $DEPLOY_DIR to have FFDec and Flash read config file in repo
    useradd --create-home -d $DEPLOY_DIR $USER && \

    # Transfer ownership
    chown --preserve-root -R $USER \
      $DEPLOY_DIR \

      # pid file directory
      /var/run/ \

      # npm global package installation path
      /usr/local/lib/ \
      /usr/local/bin/

EXPOSE ${DEPLOY_PORT}

# Setup Application
WORKDIR ${DEPLOY_DIR}
USER ${USER}
RUN chmod +x ./build/docker-entrypoint.sh && \

    npm install --only=production -g pm2 && \
    npm install --only=production

ENTRYPOINT ["./build/docker-entrypoint.sh"]
CMD ["production"]
