import xml.etree.ElementTree as etree

svg_ns = '{http://www.w3.org/2000/svg}'


class SvgParser(object):
  def __init__(self,filename):
    self.filename = filename
    self.xmlRoot = etree.parse(filename).getroot()
    if self.xmlRoot.tag != svg_ns + 'svg':
      raise TypeError('file %s does not seem to be a valid SVG file', filename)
    # Get Image width
    self.width = float(self.xmlRoot.get('width'))
    # Get Image heigh
    self.height = float(self.xmlRoot.get('height'))
    
    self.centerX = int(self.width)/2
    self.centerY = int(self.height)/2

    # Get all path in svg
    self.path = []
    for node in self.xmlRoot.iter():
      # Handle path only
      if node.tag == svg_ns + 'path':
        if node is not None:
          self.path.append(node)
   
  def convert(self,output="test.tex"):
    with open(output,"w") as f:
      # Write figure
      f.write("\\usetikzlibrary{arrows}\n")
      f.write("\\begin{tikzpicture}\n")
      var_color_name_base="color"
      var_color_name_count=1
      for path in self.path:
        if path is not None:
          style = path.get('style')
          if "fill" in style:
            color_name=var_color_name_base+str(var_color_name_count)
            var_color_name_count+=1
            hexa=style.split(":")[1].replace("#","")
            f.write("\\definecolor{"+color_name+"}{HTML}{"+str(hexa).upper()+"}\n")
          data = path.get('d').split()
          operation = None
          initialization = True
          position = None
          for p in data:
            if p.isalpha():
              # fetch
              operation = p
              if operation.lower() == "z":
                f.write("-- cycle;\n")
                break
            else:
              # init
              if initialization:
                position = self.transform(tuple(map(float,p.split(","))))
                f.write("\\draw[")
                if "fill" in style:
                  f.write("fill="+str(color_name))
                f.write("] "+str(position))
                #print(operation)
                initialization = False
              else:
               # decode
                if operation.islower():
                  # Calculate next position
                  delta = tuple(map(float,p.split(",")))
                  if len(delta) == 2:
                    delta = self.transform(delta)
                    nposition = (position[0]+delta[0],position[1]+delta[1])
                  elif len(delta) ==1:
                    # Move vertically
                    if operation == "v":
                      delta = (delta[0]/self.width,)
                      nposition = (position[0]+delta[0],position[1])
                    # Move horizontally
                    elif operation == "h":
                      delta = (delta[0]/self.height,)
                      nposition = (position[0],position[1]+delta[0])
                    else:
                      raise TypeError('Error parsing svg path')
                else:
                  delta = tuple(map(float,p.split(",")))
                  if len(delta) == 2:
                    nposition = delta
                  elif len(delta) == 1:
                    if operation == "V":
                      delta = (delta[0]/self.width,)
                      nposition = (delta[0],position[1])
                    elif operation == "H":
                      delta = (delta[0]/self.height,)
                      nposition = (position[0],delta[0])
                
                if operation.lower() in "mvh":
                  f.write("-- "+str(nposition))
                position=nposition
                  #print("ABSOLUTE")
      f.write("\\end{tikzpicture}\n") 

  def transform(self,tup,op="m"):
    if len(tup) == 2:
      return (tup[0]/self.width,tup[1]/self.height)
  def __repr__(self):
    return "SVG : "+str(self.filename)+"\nxmlRoot: "+str(self.xmlRoot)+"\nwidth: "+str(self.width)+"\nheight : "+str(self.height)
