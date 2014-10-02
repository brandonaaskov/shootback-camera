from subprocess import call
import glob
import os

os.chdir("./recordings/")
for file in glob.glob("*.h264"):
    print(file)
    encoded_file_name = os.path.splitext(file)[0] + '.mp4'
    call(['ffmpeg', '-r', '30', '-i', file, '-vcodec', 'copy', encoded_file_name])
    # ffmpeg -r 30 -i recordings/recording_45.mov -vcodec copy recordings/recording_45.mp4

# call(['ls', '-l'])
