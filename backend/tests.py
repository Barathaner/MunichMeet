import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_get_all_events():
    response = requests.get(f"{BASE_URL}/getallevents")
    print("GET /getallevents")
    print("Response:", response.json())

def test_participate():
    params = {
        "eventid": 0
    }
    response = requests.get(f"{BASE_URL}/participate", params=params)
    print("\nGET /participate")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_get_other_users_in_radius():
    payload = {
        "lat": 48.1351, 
        "lon": 11.5820,  # Munich coordinates
        "radius": 5000  # 5 km
    }
    response = requests.post(f"{BASE_URL}/getotherusersinradius", params=payload)
    print("\nPOST /getotherusersinradius")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_update_user_pos():
    payload = {
        "userid": 1,
        "lat": 48.137, 
        "lon": 11.577
    }
    response = requests.post(f"{BASE_URL}/updateuserpos", params=payload)
    print("\nPOST /updateuserpos")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_regenerate_all_events():
    response = requests.get(f"{BASE_URL}/regenerate_all_events")
    print("\nGET /regenerate_all_events")
    print("Status Code:", response.status_code)
    print("Response:", response.json())


if __name__ == "__main__":
    test_get_all_events()
    test_participate()
    test_get_other_users_in_radius()
    test_update_user_pos()
    test_regenerate_all_events()
