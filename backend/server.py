#! /usr/bin/python3

from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_folder='out/_next/static', template_folder='out')

locations = [
    {
        'title': 'HackaTUM2024 Demo!',
        'latitude': 12.3456,
        'longitude': 34.567
    }
]


@app.route('/')
def home():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/_next/static<path:path>')
def serve_static(path):
    return send_from_directory('out/_next/static', path)

@app.route('/<path:path>')
def serve_other_static(path):
    return send_from_directory('out', path)


@app.route('/api/submit', methods=['POST'])
def post_data():
    response = {
        'locations' : locations
    }

    return jsonify(response), 200



def main():
    app.run(host='0.0.0.0', port=3000, debug=True)


if __name__ == '__main__': main()
