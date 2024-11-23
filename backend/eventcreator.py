import datetime 
import time
import dotenv
import os
import requests
import random


class Place:
    def __init__(self, name, lan, lon, img_url):
        self.name = name
        self.lan = lan
        self.lon = lon
        self.img_url = img_url

    def __str__(self):
        return f"{self.name},Coord({self.lan},{self.lon})"

# places:
PARK = "Park"
WATER ="Water"
BARS = "Bars"
CAFE = "Cafe"
MUSEUM = "Museums"

# the coordinate data and a link to a photo for all places
ACTUAL_PLACES = {
    PARK : [Place("Englischer Garten", 48.156693, 11.595832,"https://www.merian.de/uploads/media/1920x1080/06/8066-mu%CC%88nchen-englischer-garten-iStock.jpg?v=1-0"),
            Place("Hofgarten", 48.142661, 11.580193, "https://upload.wikimedia.org/wikipedia/commons/b/bf/M%C3%BCnchen_Hofgartentempel.jpg"),
            Place("Westpark", 48.122983, 11.513367, "https://www.muenchen.de/sites/default/files/styles/3_2_w1008/public/2022-06/thaisala-westpark.jpg.webp"),
            Place("Olympiapark",48.174097, 11.555983, "https://placesofgermany.de/wp-content/uploads/2023/04/Muenchen-Olympiapark.webp"),
            Place("Luitpoldpark",48.170940, 11.569717, "https://www.muenchen.de/sites/default/files/styles/3_2_w320/public/2022-06/20201125-luitpoldpark-sommer-4-3.jpg.webp"),
            Place("Flaucher",48.111486, 11.557170, "https://www.muenchen.de/sites/default/files/styles/facebook/public/2022-07/isar_flaucher_2019_anettegoettlicher-11.jpg?h=502e75fa"),
            Place("Ostpark",48.113718, 11.637866, "https://www.muenchen.de/sites/default/files/styles/facebook/public/2022-06/IMG_7395.jpg?h=71976bb4"),
            Place("Old Botanical Garden",48.141781, 11.564180, "https://www.muenchen.de/sites/default/files/styles/large/public/2022-06/201206-alter-botanischer-garten-fruehling-katy-spichal.jpg.webp"),
            Place("Maximiliansanlagen",48.139285, 11.596299, "https://upload.wikimedia.org/wikipedia/commons/4/4c/Friedensengel_Brunnen_ORA.jpg"),
            Place("Südpark",48.103257, 11.510843, "https://www.muenchen.de/sites/default/files/styles/facebook/public/2022-06/02-suedpark.jpg?h=84071268")],
    WATER : [Place("Isar at Maximiliananlagen", 48.139767, 11.594912, "https://www.muenchen.de/sites/default/files/styles/facebook/public/2022-06/isar-herbst5.jpg?h=84071268"),
            Place("Flaucher",48.111486, 11.557170, "https://www.muenchen.de/sites/default/files/styles/facebook/public/2022-07/isar_flaucher_2019_anettegoettlicher-11.jpg?h=502e75fa"),
            Place("Isar at Marienklausenbrücke",48.091968, 11.549360, "https://www.all-in.de/cms_media/module_img/1564/782308_1_org_imago0058659462h.jpg"),
            Place("Isar at Brudermühlbrücke",48.116297, 11.560445, "https://goelker.lima-city.de/graffiti/img/20180408_Brudermuehlbruecke/01_Brudermuehlbruecke.jpg")],
    BARS : [Place("Irish Pub Dubliner", 48.137956, 11.579975, "https://static.wixstatic.com/media/ef6183_75f57e92e646416594b54da657a71730~mv2.jpg/v1/fill/w_980,h_735,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/ef6183_75f57e92e646416594b54da657a71730~mv2.jpg"),
            Place("Bar Milano - Torino", 48.135420, 11.582054, "https://www.sueddeutsche.de/2024/11/15/09ccd661-b944-459d-88f4-d322c42bf11f.jpeg?rect=0,1379,2661,1497&width=465&fm=jpeg&q=60"),
            Place("Robinson's Bar", 48.132045, 11.575537, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR3pPpUZXDsaDSN5PtSg-5CO9cp6ZI2V4seg&s"),
            Place("Cole and Porter Bar",48.13607315614611, 11.571484346886155, "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0b/ee/ac/6f/bar.jpg?w=600&h=-1&s=1"),
            Place("Kilians Irish Pub",48.1387935870999, 11.57458561763233, "https://media-cdn.tripadvisor.com/media/photo-m/1280/15/10/e3/33/kilians-irish-pub.jpg"),
            Place("Bar Comercial",48.14115541465443, 11.576157501577981, "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/d5/5a/f9/ambiente-der-bar-comercial.jpg?w=1200&h=-1&s=1"),
            Place("Garcon",48.1340526142008, 11.575269568960815, "https://barguide.mixology.eu/wp-content/uploads/sites/7/2019/04/pacific-times-muenchen-550x550.jpg"),
            Place("Kilombo",48.1359149245802, 11.544236802174158, "https://www.sueddeutsche.de/2022/06/13/070883fa-ee74-414d-8bf6-89165eb4b195.jpeg?q=60&fm=jpeg&width=1000&rect=0%2C36%2C459%2C258"),
            Place("Café Bar Cockpit",48.123784788983805, 11.547887690257022, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyd4NqQTYnozICvcwkEHXlxYN12J4MVYduvQ&s"),
            Place("The Keg Bar",48.15811859900634, 11.585307085485693, "https://lifeintown.de/wp-content/uploads/2017/03/the-keg-bar-2.jpg")],
    CAFE : [Place("Cafe Guglhupf", 48.13742451631517, 11.573585156646296, "https://www.cafe-guglhupf.de/wp-content/uploads/2018/12/P1010589.jpg"),
            Place("Cafe Fräulein", 48.13453593648883, 11.578191906713144, "https://lh4.googleusercontent.com/proxy/SU16fuo2fDoRdLM1pw90zjr-s207N6iooBWZi9RuE779EQgTM2UsA38pDaNtoOSz5LhxlQLc2eimhsSdjODWVhGmcSzmoWyasf2JxKyrgFZvhqvltw8P4MLlG70g1TTwJ4Pt"),
            Place("Cafe Frischhut", 48.1348510498306, 11.57458126106219, "https://www.cappumum.com/wp-content/uploads/2020/02/Cafe-Frischhut-Schmalznudel-4.jpg"),
            Place("Cafe Puck",48.14935463164334, 11.575228539596507, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ7MBHT7jjbYnvD3J0jVHgZxfj-9tuYtum5Q&s"),
            Place("Coffeemamas Cafe",48.12779059916486, 11.554331897251833, "https://www.amazedmag.de/wp-content/uploads/2014/05/cm12.jpg")],
    MUSEUM : [Place("Haus der Kunst", 48.14387117855361, 11.585864334180116, "https://www.sueddeutsche.de/2022/06/08/5565b421-cded-40ca-9a88-a542304d9e33.jpeg?q=60&fm=webp&width=1200&rect=0%2C195%2C1183%2C665"),
            Place("Alte Pinakothek", 48.148207654179004, 11.570054193985591, "https://www.pinakothek.de/uploads/media/1024x/09/7199-18_Saal%20VII_%28c%29%20BSTGS%20Foto%20Elisabeth%20Greil.jpg?v=1-1"),
            Place("Lenbachhaus", 48.146636027760266, 11.5641000622537, "https://www.muenchen.de/sites/default/files/styles/3_2_w1008/public/2022-06/34_2_Florian%20Holzherr.jpeg.webp"),
            Place("German Transport Museum",48.13254518045949, 11.542088888711675, "https://www.deutsches-museum.de/assets/_processed_/d/c/csm_Verkehrszentrum_Halle1_Ueberblick_85c25f7b11.jpg"),
            Place("Deutsches Museum",48.129818398953795, 11.583411059170965, "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/59/13/07/deutsches-museum.jpg?w=1200&h=-1&s=1"),
            Place("Museum Five Continents",48.1376274533486, 11.585577259546021, "https://www.museum-fuenf-kontinente.de/assets/resources/Standardseiten-Intros/Home-Aktuelles-Bilder/MFK_01062023_02_kaestner-web.jpg"),
            Place("Toy Museum Munich",48.136875122726934, 11.576818427854235, "https://lh3.googleusercontent.com/proxy/65qTvAYRzNgh9TcovXdbJWuAw2vAM7em8hq3rkfTH7TR-FC2Pxyh_7jzlDjSfckbfkwuyu2vkyEqiZFxd_CJ153UgAsJPD08NCSGFDVR6CxVmfxn-2hj4yjsaiyMzG5aRkvm7FSGZf9-wSzfxpisoKuGIU8lYnYOhJjH5aUhSOqrr3VusBmvuAQZQzQ1-rf_rAZiFeIQAVIuc6hOLsrFp7yE9OS-B9d5a8FdxgsxQQ")]
}

# the amount of events being spawned by add_new_events()
EVENTS_PER_5_DAYS = 20
next_ID = 0

cur_planned_events = []
weather_forecast = []




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
    
    
# All Event types with their stats
EVENTS = [
    EventPreset("Beach Day", [WATER],datetime.time(10),datetime.time(17),3, 24, 0, 
                "This get-together offers a variety of activities for everyone to enjoy." + 
                "You can swim in designated areas, enjoying the cool, refreshing water, or relax together " +
                "with picnic blankets and snacks. Bring your barbecue and " + 
                "share meals with friends and future friends."),
    EventPreset("Picnic together", [PARK],datetime.time(10),datetime.time(17),2, 20, 0,
                "Looking to make new friends and enjoy a relaxing day outdoors? Come join our Community Picnic. " + 
                "You can bring your own food, share it and connect over discovering foods others have brought."),
    EventPreset("Communal Walk", [PARK,WATER],datetime.time(9),datetime.time(20),1, 0, 10,
                "Join for a casual group walk where great conversations and new connections are just a few steps away! " +
                "Just continue along for a bit or explore the whole park with some interesting new people."),
    EventPreset("Museum Tour", [MUSEUM],datetime.time(10),datetime.time(17),2, -999, 999,
                "Discover the wonders of art, history, and science AND meet new friends on this trip to the museum! " +
                "Whether you're a culture enthusiast or just curious to try something new with new people, " +
                "this is the perfect opportunity to enjoy a day of discovery while making meaningful connections."),
    EventPreset("Open Get Together", [PARK,WATER,CAFE,BARS],datetime.time(11),datetime.time(18),3, -999, 999,
                "Looking for a fun, casual way to meet new faces? Come hang out together!" +
                "Whether you're new to the area, looking to meet people with shared interests, or " + 
                "just eager to step outside your routine, this is the perfect place to connect with others in a friendly, stress-free environment."),
    EventPreset("Reading Together", [PARK,WATER,CAFE],datetime.time(10),datetime.time(17),3, 20, 0,
                "Love books and great conversations? Come join this Reading & Discussion event, " +
                "where book lovers gather to read, share ideas, and meet new people in a cozy, welcoming atmosphere"),]

class PlannedEvent:
    def __init__(self, name, place, date, duration, description, attendees):
        self.name = name
        self.place = place
        self.date = date
        self.duration = duration
        self.description = description
        self.attendees = attendees

    def __str__(self):
        return f"PlannedEvent({self.name},{self.place},{self.date},{self.duration}h)\n"

# return a random element of a list
def choose_random(list):
    return list[random.randint(0,len(list)-1)]

# get the weather data for the next couple of days (temperature and precipitation)
def get_weather_data():
    weather_data = requests.get(f"https://api.openweathermap.org/data/2.5/forecast?lat=48.1351&lon=11.5820&units=metric&appid={os.getenv('WEATHER_API_KEY')}")
    weather = []

    timeslot = 0
    temperature = 0
    rain = 0
    day_of_weather = datetime.datetime.today() if datetime.datetime.today().hour < 12 else (datetime.datetime.today() + datetime.timedelta(days=1))

    for i in range(len(weather_data.json()['list'])):
        timeslot += 1
        if('rain' in weather_data.json()['list'][i]):
            rain += weather_data.json()['list'][i]['rain']['3h']

        if(timeslot == 8):
            weather.append((day_of_weather,temperature,rain))
            rain = 0
            timeslot = 0
            day_of_weather += datetime.timedelta(days=1)

        if(weather_data.json()['list'][i]['dt_txt'].endswith("12:00:00")):
            temperature = weather_data.json()['list'][i]['main']['temp']
    return weather

# WIP: get Data for Weihnachtsmärkte 
def get_weihnachts_event_data():
    weihnachts_data = requests.get("https://opendata.muenchen.de/dataset/92515550-b236-4a08-9259-260513889548/resource/312260ca-7346-4b85-a357-3764bcadc6dd/download/weihnachtsmarkte-muenchen-2024-v2.csv")
    return weihnachts_data

# get a random place of all the places of one type
def get_random_specific_place(place_type):
    amount_places = len(ACTUAL_PLACES[place_type])
    return ACTUAL_PLACES[place_type][random.randint(0,amount_places-1)]


# look if there exists a day, where the weather is good enough for the event
def find_suitable_date(event_preset):
    possible_dates = [i for i in weather_forecast if i[1] > event_preset.lowest_temp and i[2] < event_preset.highest_precipitation]
    return None if len(possible_dates) == 0 else choose_random(possible_dates)[0]
    
# generate a random event to add to planned events
def generate_event():
    suitable_date = None 
    while suitable_date == None:
        event_preset = EVENTS[random.randint(0,len(EVENTS)-1)]
        suitable_date = find_suitable_date(event_preset)

    time = datetime.time(random.randint(event_preset.earliest_Time.hour,event_preset.latest_Time.hour-event_preset.usual_Length))
    suitable_date = datetime.datetime(suitable_date.year,suitable_date.month,suitable_date.day,time.hour)

    event = PlannedEvent(event_preset.name,
                         get_random_specific_place(choose_random(event_preset.placetypes)),
                         suitable_date,
                         event_preset.usual_Length,
                         event_preset.default_description,
                         0)
    next_ID += 1
    return event

# make all new events for the next 5 days
def add_new_events():
    for i in range(EVENTS_PER_5_DAYS):
        cur_planned_events.append(generate_event())


def add_pitch_event():
    date = datetime.datetime(2024,11,24,10,15)
    place = Place("Technical University Munich",48.26252531823145, 11.668047677551074,"https://strohtum.de/media/2022_08/csm_2006_1015Bild0136_4386718267.jpg")
    event = PlannedEvent(next_ID, 
                         "HackaTUM MunichMeet Pitch",
                         place,
                         date,
                         1,
                         "Feeling lonely in today’s busy world? You’re not alone — and we’re here to help. "+
                         "Come watch the pitch of MunichMeet, designed to make meaningful connections easier, " +
                         "whether you’re looking for friends, a supportive community, or just someone to talk to, we're here for you!",
                         0)
    next_ID += 1
    cur_planned_events.append(event)




dotenv.load_dotenv()
weather_forecast = get_weather_data()


# just a loop that keeps on producing different sets of planned_events every 5 seconds
#while True:
 #   cur_planned_events = []
  #  add_new_events()
   # print(' '.join(map(str, cur_planned_events)) + "\n")    
    #time.sleep(5)


 