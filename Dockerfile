FROM resin/rpi-raspbian

# RUN executes commands inside the container
RUN apt-get update
RUN apt-get install -y libraspberrypi-bin
RUN ["node -v"]
RUN ["raspi-config"]

# copies files from the current directory into the container, e.g. ADD <src> <dest>
ADD . /app

# There can only be one CMD instruction in a Dockerfile.
# If you list more than one CMD then only the last CMD will take effect.
CMD npm start
