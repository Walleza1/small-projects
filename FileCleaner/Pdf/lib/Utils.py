class PrintInColor:
  RED = '\033[91m'
  GREEN = '\033[92m'
  BLUE = '\033[34m'
  YELLOW = '\033[93m'
  LIGHT_PURPLE = '\033[94m'
  PURPLE = '\033[95m'
  END = '\033[0m'

  @classmethod
  def red(cls, s, **kwargs):
    print(cls.RED + str(s) + cls.END, **kwargs)
  
  @classmethod
  def green(cls, s, **kwargs):
    print(cls.GREEN + str(s) + cls.END, **kwargs)

  @classmethod
  def yellow(cls, s, **kwargs):
    print(cls.YELLOW + str(s) + cls.END, **kwargs)

  @classmethod
  def lightPurple(cls, s, **kwargs):
    print(cls.LIGHT_PURPLE + str(s) + cls.END, **kwargs)

  @classmethod
  def purple(cls, s, **kwargs):
    print(cls.PURPLE + str(s) + cls.END, **kwargs)

  @classmethod
  def blue(cls, s, **kwargs):
    print(cls.BLUE + str(s) + cls.END, **kwargs)

