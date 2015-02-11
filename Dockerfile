FROM resin/rpi-raspbian:wheezy-2015-01-15

RUN apt-get update
# RUN apt-get install -y python python-dev libraspberrypi-bin python-pip

# Install picamera python module using pip
# RUN pip install picamera

# copies files from the current directory into the container, e.g. ADD <src> <dest>
ADD . /app

CMD ["node", "app.js"]

