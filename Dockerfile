FROM resin/rpi-raspbian:wheezy-2015-01-15

RUN apt-get update
RUN apt-get install -y libraspberrypi-bin

# copies files from the current directory into the container, e.g. ADD <src> <dest>
ADD . /app

# There can only be one CMD instruction in a Dockerfile.
# If you list more than one CMD then only the last CMD will take effect.
CMD node app.js
