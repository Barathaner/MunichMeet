import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_get_all_events():
    response = requests.get(f"{BASE_URL}/getallevents")
    print("GET /getallevents")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_participate():
    params = {
        "userid": 1,
        "eventid": 1
    }
    response = requests.get(f"{BASE_URL}/participate", params=params)
    print("\nGET /participate")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_get_other_users_in_radius():
    payload = {
        "position": {"latitude": 48.1351, "longitude": 11.5820},  # Munich coordinates
        "radius": 5000  # 5 km
    }
    response = requests.post(f"{BASE_URL}/getotherusersinradius", json=payload)
    print("\nPOST /getotherusersinradius")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_update_user_pos():
    payload = {
        "position": {"latitude": 48.137, "longitude": 11.577},
        "userid": 1
    }
    response = requests.post(f"{BASE_URL}/updateuserpos", json=payload)
    print("\nPOST /updateuserpos")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_regenerate_all_events():
    response = requests.get(f"{BASE_URL}/regenerate_all_events")
    print("\nGET /regenerate_all_events")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

def test_register_user():
    payload = {
        "userid": 2,
        "position": {"latitude": 48.139, "longitude": 11.586}
    }
    response = requests.post(f"{BASE_URL}/registrateuser", json=payload)
    print("\nPOST /registrateuser")
    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    test_get_all_events()
    test_participate()
    test_get_other_users_in_radius()
    test_update_user_pos()
    test_regenerate_all_events()
    test_register_user()