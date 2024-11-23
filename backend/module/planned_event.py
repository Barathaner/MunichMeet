import datetime

from module.user import User
from module.place import Place

class PlannedEvent:
    next_event_id = 0
    def __init__(self, name: str, place: Place, date: datetime.datetime, duration: int, description: str, attendees: int):
        self.eventid = PlannedEvent.next_event_id
        self.name = name
        self.place = place
        self.date = date
        self.duration = duration
        self.description = description
        self.attendees = attendees

        PlannedEvent.next_event_id += 1

    def inc_attendee(self) -> None:
        self.attendees += 1

    def __str__(self):
        return f"PlannedEvent({self.name},{self.place},{self.date},{self.duration}h)\n"