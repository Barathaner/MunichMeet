

class User:
    next_user_id = 0
    def __init__(self, latitude: float, longitude: float) -> None:
        self.userid = User.next_user_id
        self.latitude = latitude
        self.longitude = longitude

        User.next_user_id += 1