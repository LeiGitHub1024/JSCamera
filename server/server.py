from flask import Flask, request
from flask_cors import CORS
import time
import json
from convert import imgEnhance


app = Flask(__name__)
cors = CORS(app)
app.extensions['cors'] = cors
cors.origins = ['http://127.0.0.1/5500', ]


@app.route('/llie', methods=['POST'])
def handle_post_request():
    request_dict = json.loads(request.data.decode('utf-8'))
    lowImg64 = request_dict['image_base64']

    time.sleep(0.1)
    brightImg64 = imgEnhance(lowImg64)
    # print(brightImg64)

    return {"code":0, "image":brightImg64}

if __name__ == '__main__':
    app.run()