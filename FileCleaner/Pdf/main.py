#!/usr/bin/env python3

from lib.Parser import PdfParser
import sys, os

def usage():
  print("Usage "+str(sys.argv[0])+" file")
  sys.exit(1)

def main():
  if len(sys.argv) != 2:
    usage()
  else:
    if not(os.path.isfile(sys.argv[1])):
      usage()

  print("Launched")


if __name__ == "__main__":
  main()
