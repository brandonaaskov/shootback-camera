FROM resin/rpi-raspbian

# RUN executes commands inside the container
RUN wget http://nodejs.org/dist/v0.11.9/node-v0.11.9-linux-arm-pi.tar.gz
RUN tar -xvzf node-v0.11.9-linux-arm-pi.tar.gz
RUN node-v0.11.9-linux-arm-pi/bin/node --version
RUN pwd

# copies files from the current directory into the container, e.g. ADD <src> <dest>
ADD . /app

# There can only be one CMD instruction in a Dockerfile.
# If you list more than one CMD then only the last CMD will take effect.
CMD npm start
