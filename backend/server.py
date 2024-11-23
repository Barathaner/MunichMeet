#! /usr/bin/python3

import math

from flask import Flask, send_from_directory, jsonify, request

from module.user import User
from module import event_generator

app = Flask(__name__, static_folder='out/_next/static', template_folder='out')

all_users = {}
all_events = {}

@app.route('/')
def home():
    return send_from_directory(app.template_folder, 'index.html')


@app.route('/_next/static<path:path>')
def serve_static(path):
    return send_from_directory('out/_next/static', path)


@app.route('/<path:path>')
def serve_other_static(path):
    return send_from_directory('out', path)


# APIs

@app.route('/api/getallevents', methods=['GET'])
def getallevents():
    global all_events
    return jsonify({ 'events': all_events }), 200


@app.route('/api/participate', methods=['GET'])
def participate():
    try:
        userid = int(request.args.get('userid'))
        eventid = int(request.args.get('eventid'))
    except:
        return jsonify({ 'status' : 'Error: Invalid arguments!' }), 400
    

    try:
        all_events[eventid].attendees.append(all_users[userid])
    except:
        return jsonify({ 'status': f'Error: Event with eventid={eventid} or User with userid={userid} does not exist!' }), 400
     
    return jsonify({ 'status': f'Successfully registrated User with userid={userid} to Event with eventid={eventid}' })


@app.route('/api/getotherusersinradius', methods=['POST'])
def getotherusersinradius():
    R = 6_371_000  # Earth's radius in meters

    try:
        position = jsonify(request.args.get('position'))
        radius = int(request.args.get('radius'))
    except:
        return jsonify({ 'status': 'Error: Invalid arguments!' }), 400

    latitude_main_user, longitude_main_user = map(math.radians, [position['latitude'], position['longitude']])

    users_in_radius = {}
    for userid, user in all_users.items():
        latitude_current_user, longitude_current_user = map(math.radians, user.latitude, user.longitude)

        dlat = latitude_current_user - latitude_main_user
        dlon = longitude_current_user - longitude_main_user

        # Haversine formula
        a = math.sin(dlat / 2)**2  +  math.cos(latitude_main_user) * math.cos(latitude_current_user) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        distance = R * c

        if distance <= radius:
            users_in_radius.update({ userid : user })
        
    return jsonify({ 'users' : users_in_radius }), 201


@app.route('/api/updateuserpos', methods=['POST'])
def updateuserpos():
    try:
        new_position = jsonify(request.args.get('position'))
        userid = int(request.args.get('userid'))

        latitude = float(new_position['latitude'])
        longitude = float(new_position['longitude'])
    except:
        return jsonify({ 'status': 'Invalid arguments!' }), 400

    try:
        all_users[userid].latitude = latitude
        all_users[userid].longitude = longitude
    except:
        return jsonify({ 'status' : f'User with userid={userid} does not exist!' }), 400


    return jsonify({ 'status': 'Position updated successfully!' }), 201


@app.route('/api/regenerate_all_events', methods=['GET'])
def regenerate_all_events():
    global all_events
    all_events.clear()
    event_generator.add_new_events(all_events)
    return jsonify({ 'events': all_events }), 200


@app.route('/api/registrateuser', methods=['POST'])
def login_or_registrate_user():
    try:
        userid = request.args.get('userid')
        position = jsonify(request.args.get('position'))
        if userid is None: raise ValueError
    except:
        new_user = User(position['latitude'], position['longitude'])
        userid = new_user.userid
        all_users.update({ userid : new_user })
    
    return jsonify({ 'user': userid }), 201



def main():
    event_generator.add_new_events(all_events)
    app.run(host='0.0.0.0', port=3000, debug=True)


if __name__ == '__main__': main()
