class EventPreset:
    def __init__(self, name, placetypes, earliest_Time, latest_Time, usual_Length, lowest_temp, highest_precipitation, default_description):
        self.name = name
        self.placetypes = placetypes
        self.earliest_Time = earliest_Time
        self.latest_Time = latest_Time
        self.usual_Length = usual_Length
        self.lowest_temp = lowest_temp
        self.highest_precipitation = highest_precipitation
        self.default_description = default_description

    def __str__(self):
        return f"EventType({self.placetypes},{self.earliest_Time},{self.latest_Time},{self.usual_Length})"