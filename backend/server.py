#! /usr/bin/python3

import math

from flask import Flask, send_from_directory, jsonify, request

from module.user import User
from module import event_generator

app = Flask(__name__, static_folder='out/_next/static', template_folder='out')

all_users = set()
all_events = set()

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
    

    event_to_participate = None
    for event in all_events:
        if event.eventid == eventid:
            event_to_participate = event

    if event_to_participate is None:
        return jsonify({ 'status': f'Error: Event with eventid={eventid} does not exist!' }), 400
    
    
    found_user = False
    for user in all_users:
        if user.userid == userid:
            found_user = True        
            event.attendees.append(user)
        
    if not found_user:
        return jsonify({ 'status' : f'Error: User with userid={userid} does not exist!' }), 400


@app.route('/api/getotherusersinradius', methods=['POST'])
def getotherusersinradius():
    R = 6_371_000  # Earth's radius in meters

    try:
        position = jsonify(request.args.get('position'))
        radius = int(request.args.get('radius'))
    except:
        return jsonify({ 'status': 'Error: Invalid arguments!' }), 400

    latitude_main_user, longitude_main_user = map(math.radians, [position['latitude'], position['longitude']])

    users_in_radius = []
    for user in all_users:
        latitude_current_user, longitude_current_user = map(math.radians, user.latitude, user.longitude)

        dlat = latitude_current_user - latitude_main_user
        dlon = longitude_current_user - longitude_main_user

        # Haversine formula
        a = math.sin(dlat / 2)**2  +  math.cos(latitude_main_user) * math.cos(latitude_current_user) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        distance = R * c

        if distance <= radius:
            users_in_radius.add(user)
        
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

    found_user = False
    for user in all_users:
        if user.userid == userid:
            found_user = True
            user.latitude = latitude
            user.longitude = longitude
    
    if not found_user:
        return jsonify({ 'status' : f'User with userid={userid} does not exist!' }), 400


    return jsonify({ 'status': 'Position updated successfully!' }), 201


@app.route('/api/regenerate_all_events', methods=['GET'])
def regenerate_all_events():
    global all_events
    all_events.clear()
    event_generator.add_new_events(all_events)
    return jsonify({ 'events': all_events }), 200


@app.route('/api/registrateuser', methods=['POST'])
def loginorregistrateuser():
    userid = request.args.get('userid')
    position = jsonify(request.args.get('position'))

    if userid is None:
        new_user = User(position['latitude'], position['longitude'])
        userid = new_user.userid
        all_users.add(new_user)
    
    return jsonify({ 'userid': userid }), 201



def main():
    event_generator.add_new_events(all_events)
    app.run(host='0.0.0.0', port=3000, debug=True)


if __name__ == '__main__': main()
