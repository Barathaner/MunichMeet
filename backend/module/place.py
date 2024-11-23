class Place:
    def __init__(self, name, lan, lon, img_url):
        self.name = name
        self.lan = lan
        self.lon = lon
        self.img_url = img_url

    def __str__(self):
        return f"{self.name},Coord({self.lan},{self.lon})"