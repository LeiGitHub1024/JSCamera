import base64
from PIL import Image
from io import BytesIO
import numpy as np

def gamma(img_jpeg,idx=0.5):
  img_array = np.array(img_jpeg)
  img_array = np.array(((img_array/255)**idx)*255, dtype=np.uint8)
  img_gamma_jpeg = Image.fromarray(img_array)
  return img_gamma_jpeg

def imgEnhance(inputString):
  ##### 输入字符串格式为："data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAA......", 将其按逗号分割为前后两部分。
  [prefix,low_64]=inputString.split(',')

  ##### 图像格式转换，base64 =》字节流 =》加载到内存 =》转成jpeg
  low_byte = base64.b64decode(low_64)  #得到一个byteObject
  low_byte = BytesIO(low_byte) #将byteObject加载到内存
  low_jpeg = Image.open(low_byte)
  # low_jpeg.show()

  ##### 调用最简单的gamma变换，将图像调亮
  bright_jpeg = gamma(low_jpeg)
  # bright_jpeg.show()

  ##### 图像格式转换，jpeg => 以JPEG格式存到BytesIO => base64byte => base64str 
  im_file = BytesIO()
  bright_jpeg.save(im_file, format="JPEG")
  bright_bytes = im_file.getvalue()  # bright_bytes: image in binary format.
  bright_64 = str(base64.b64encode(bright_bytes),'utf-8')

  ##### 
  return prefix+','+bright_64




























img_64 = "data:image/jpeg;base64,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"
img_64 = 'ss,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'

imgEnhance(img_64)



