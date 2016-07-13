#!/usr/bin/env python

# Import the os module, for the os.walk function
import os
import re
 
# Set the directory you want to start from
rootDir = os.getcwd()
for dirName, subdirList, fileList in os.walk(rootDir):
    print('Found directory: %s' % dirName)

    for fname in fileList:
        r = re.match("^.*\.json$", fname)
        if r :
            # print fname
            # get id
            fullname = os.path.join(dirName, fname)
            print fullname
            with open(fullname, 'r') as f:
                lines = f.read()
                fid = re.findall("\"id\":.*\"(.*)\"$", lines, re.DOTALL|re.MULTILINE)
                if fid:
                    fullpath = os.path.join(rootDir, dirName)
                    os.chdir(fullpath)
                    command = "gdget.py -f json %s" % fid[0]

                    r = os.system(command)
                    print r
                    



