from lib.Utils import *


class PdfParser(object):
  def __init__(self,filename):
    self.filename = filename
    print(filename)
  
  def __repr__(self):
    return self.filename+" (PDF) "
