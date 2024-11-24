#! /usr/bin/python3

import math
from flask_cors import CORS
from flask import Flask, send_from_directory, jsonify, request

from module.user import User
from module import event_generator

app = Flask(__name__, static_folder='out/_next/static', template_folder='out')
CORS(app)
all_users = {"test":User(48.2624566, 11.6672299)}
all_events = {}


def serialize_event(event):
        return {
            "eventid": event.eventid,
            "name": event.name,
            "place": {
                "name": event.place.name,
                "lat": event.place.lan,
                "lon": event.place.lon,
                "img_url": event.place.img_url,
            },
            "date": event.date.isoformat(),
            "duration": event.duration,
            "description": event.description,
            "attendees": event.attendees,
        }

        


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
    # Serialize all events
    serialized_events = {key: serialize_event(event) for key, event in all_events.items()}
    
    return jsonify({'events': serialized_events}), 200


@app.route('/api/participate', methods=['GET'])
def participate():
    try:
        eventid = int(request.args.get('eventid'))
    except:
        return jsonify({ 'status' : 'Error: Invalid arguments!' }), 400
    
    

    try: 
        all_events[eventid].attendees += 1
    except:
        return jsonify({ 'status': f'Error: Event with eventid={eventid} does not exist!' }), 400
     
    return jsonify({ 'status': f'Successfully registrated User to Event with eventid={eventid}' })


@app.route('/api/getotherusersinradius', methods=['POST'])
def getotherusersinradius():
    R = 6_371_000  # Earth's radius in meters

    try:
        data = request.get_json()  # Parse JSON body
        lat = float(data['lat'])
        lon = float(data['lon'])
        radius = int(data['radius'])
        current_user_id = str(data['userid'])  # Get current user's ID as string
    except (KeyError, TypeError, ValueError):
        return jsonify({'status': 'Error: Invalid arguments!'}), 400

    latitude_main_user, longitude_main_user = map(math.radians, [lat, lon])

    users_in_radius = {}
    for userid, user in all_users.items():
        # Skip the current user
        if str(userid) == current_user_id:
            continue

        latitude_current_user, longitude_current_user = map(math.radians, [user.latitude, user.longitude])

        dlat = latitude_current_user - latitude_main_user
        dlon = longitude_current_user - longitude_main_user

        # Haversine formula
        a = math.sin(dlat / 2)**2 + math.cos(latitude_main_user) * math.cos(latitude_current_user) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        distance = R * c

        if distance <= radius:
            users_in_radius.update({userid: user.__dict__})
        
    return jsonify({'users': users_in_radius}), 201





@app.route('/api/updateuserpos', methods=['POST'])
def updateuserpos():
    try:
        data = request.json
        userid = data['userid']
        lat = float(data['lat'])
        lon = float(data['lon'])
    except:
        return jsonify({ 'status': 'Invalid arguments!' }), 400

    if(userid not in all_users):
        all_users[userid] = User(lat,lon)


    try:
        all_users[userid].latitude = lat
        all_users[userid].longitude = lon
    except:
        return jsonify({ 'status' : f'User with userid={userid} does not exist!' }), 400


    return jsonify({ 'status': 'Position updated successfully!' }), 201


@app.route('/api/regenerate_all_events', methods=['GET'])
def regenerate_all_events():
    all_events.clear()
    event_generator.add_new_events(all_events)
    serialized_events = {key: serialize_event(event) for key, event in all_events.items()}
    
    return jsonify({'events': serialized_events}), 200




def main():
    event_generator.add_new_events(all_events)
    app.run(host='0.0.0.0', port=8000, debug=True)


if __name__ == '__main__': main()
