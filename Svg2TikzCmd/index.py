#!/usr/bin/env python3

from lib.SvgParser import *
import sys

def usage():
  print("Usage "+str(sys.argv[0])+" Svg_file")
  sys.exit(1)

def main():
  if len(sys.argv) != 2:
    usage()    
  else:
    svg = SvgParser(sys.argv[1])
    svg.convert()

if __name__ == "__main__":
  main()
