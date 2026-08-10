from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import cv2
import numpy as np

import uuid
import pandas as pd

app = Flask(__name__)
CORS(app, origins=["*"])

@app.route('/', methods=['GET'])
def main_page():
    return ('YOU HAVE NOW ENTERED PLANET FISH')

@app.route('/initial-upload', methods=['POST'])
def initial_upload():
    name = request.form.get('name')
    file = request.files.get('file')

    if not name or not file:
        return jsonify({'error': 'Missing name or file'}), 400
    else:
        nparr = np.frombuffer(file.read(), np.uint8)
        process_image(nparr)

        response = send_file("temp.png", mimetype="image/png",  as_attachment=True, download_name=f"{name}'s Fish.png")

        return response

@app.route('/final-upload', methods=['POST'])
def final_upload():
    id = uuid.uuid1()
    file = request.files.get("image")
    file.save(f"./fishes/{id}.png")

    name = request.form.get("name")
    size = request.form.get("size")
    sociallvl = request.form.get("sociallvl")
    anxietylvl = request.form.get("anxietylvl")
    speed = request.form.get("speed")
    sleeplength = request.form.get("sleeplength")
    sleephabits = request.form.get("sleephabits")
    philosophy = request.form.get("philosophy")

    newRow = pd.DataFrame([[id, name, size, sociallvl, anxietylvl, speed, sleeplength, sleephabits, philosophy]])
    newRow.to_csv("database.csv", mode="a", index=False, header=False)
    
    return ("ok")

@app.route("/database", methods=["GET"])
def database():
    database = pd.read_csv("database.csv")
    databaseList = database.to_numpy().tolist()
    return databaseList

@app.route("/image/<id>.png", methods=["GET"])
def returnImage(id):
    response = send_file(f"./fishes/{id}.png", mimetype="image/png")
    return response


def process_image(nparr):
    # Open image
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (55, 55), 0)
    _, thresh = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY_INV)
    edge = cv2.Canny(blur, 5, 10)

    k = np.ones((15, 15), np.uint8) 
    dilated = cv2.dilate(edge, k, 1)  

    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    max = 0
    max_index = 0
    for index, c in enumerate(contours):
        if(cv2.contourArea(c) > max):
            max_index = index
            max = cv2.contourArea(c)

    print(max)

    mask = np.zeros_like(image)
    # cv2.drawContours(mask, contours, -1, (255, 255, 255), cv2.FILLED)
    cv2.fillPoly(mask, pts =[contours[max_index]], color=(255,255,255))

    mask_thresh = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    transparent = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
    transparent[:, :, 3] = mask_thresh

    x, y, w, h = cv2.boundingRect(contours[max_index])
    cropped_image = transparent[y:y+h, x:x+w]

    aspect_ratio = w/h

    if(aspect_ratio > 1):
        scaling_interpolation = cv2.INTER_AREA if w > 500 else cv2.INTER_CUBIC
        resize_image = cv2.resize(cropped_image, (400, round(400/aspect_ratio)), interpolation = cv2.INTER_AREA)
    else:
        scaling_interpolation = cv2.INTER_AREA if h > 200 else cv2.INTER_CUBIC
        resize_image = cv2.resize(cropped_image, (round(400 * aspect_ratio), 400), interpolation = cv2.INTER_AREA)

    cv2.imwrite("temp.png", resize_image)

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)