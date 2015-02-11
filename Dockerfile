FROM resin/rpi-raspbian:wheezy-2015-01-15

RUN apt-get update
RUN apt-get install -y libraspberrypi-bin

# copies files from the current directory into the container, e.g. ADD <src> <dest>
ADD . /app
