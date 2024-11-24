'use client';

import { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUserPoints } from './context/context';
import { useRouter } from "next/navigation";
import EventModal from './components/EventModal';
import Scoreboard from './components/Scoreboard';
import QrReaderFeedback from './components/QrReaderFeedback';

export default function Home() {
  const router = useRouter();
  const mapRef = useRef(null); // Reference for the map
  const userMarkerRef = useRef(null); // Reference for the user marker
  const [events, setEvents] = useState([]); // State to store events
  const nearbyMarkersRef = useRef({}); // Reference to manage nearby user markers
  const hackatumeventRef = useRef(null); // Reference to manage nearby user markers

  const [userPosition, setUserPosition] = useState({
    lat: null,
    lng: null,
  });
  const [nearbyUsers, setNearbyUsers] = useState([]); // State to store nearby users

  function initializeUserPosition() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });

        },
        (error) => console.error('Error retrieving location:', error),
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
  async function getEvent() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getallevents`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Ensures compatibility with Flask-CORS
      },
    });

    const data = await res.json(); // Parse JSON response
    return data;
  }

  
// Fetch nearby users every 2 seconds
useEffect(() => {
  let intervalId;

  const fetchNearbyUsers = async () => {
    if (!userPosition.lat || !userPosition.lng || !name) return; // Exit early if parameters are invalid

    try {
      const radius = 500; // Radius in meters

      const requestBody = {
        lat: userPosition.lat,
        lon: userPosition.lng,
        radius: radius,
        userid: name, // Add current user's ID
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getotherusersinradius`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (res.ok) {
        setNearbyUsers(Object.values(data.users)); // Update the nearbyUsers state
      } else {
        console.error('Error fetching nearby users:', data.status);
      }
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
    }
  };

  fetchNearbyUsers(); // Fetch immediately on mount
  intervalId = setInterval(fetchNearbyUsers, 2000); // Fetch every 2 seconds

  return () => {
    clearInterval(intervalId); // Cleanup on unmount
  };
}, [userPosition]);



  useEffect(() => {
    let intervalId;

    const fetchEvents = async () => {
      try {
        const data = await getEvent();
        setEvents(Object.values(data.events)); // Convert object to array

      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Initial fetch and then set interval
    fetchEvents();
    intervalId = setInterval(fetchEvents, 2000); // Run every 5 seconds

    // Cleanup the interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures it runs only once on mount
  // Get the user points from the context
  const { points, addPoints, resetPoints, name ,showSuccess, setName, showEvent,setShowEvent} = useUserPoints();

  function addUserMarker() {
    // Create a custom HTML element for the marker
    const el = document.createElement('div');
    el.style.backgroundImage = `url('/usermarker.png')`; // Path to your custom icon
    el.style.width = '70px'; // Set the width of the icon
    el.style.height = '70px'; // Set the height of the icon
    el.style.backgroundSize = 'contain'; // Ensure the icon fits within the bounds
    el.style.backgroundRepeat = 'no-repeat'; // Prevent tiling
    el.style.borderRadius = '50%'; // Optional: make it circular

    return new mapboxgl.Marker({ element: el })
      .setLngLat([userPosition.lng, userPosition.lat])
      .addTo(mapRef.current);
  }

  function addEventMarker(event) {
    if (!mapRef.current) return; // Ensure the map is initialized
    let url = '/usermarker.png';
    if (event.name =='HackaTUM MunichMeet Pitch')
      url = '/minga.jpg';
    const el = document.createElement('div');
    el.style.backgroundImage = `url(${url})`; // Path to event icon
    el.style.width = '70px';
    el.style.height = '70px';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.borderRadius = '50%';
    el.onclick = function()
    {
      setEvent(event);
      setShowEvent(true);
    };

    // Create a popup with event information
    const popupContent = `
      <div style="text-align: center; color: black;" onclick="handleClick()">
        <h3 style="margin-bottom: 5px; color: black;">${event.name}</h3>
        <img src="${event.place.img_url}" alt="Event Image" style="width: 150px; height: auto; border-radius: 10px; margin-bottom: 10px;">
        <p style="color: black;">${event.description}</p>
        <p style="color: black;"><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p style="color: black;"><strong>Location:</strong> ${event.place.name}</p>
      </div>
    `;

    

    new mapboxgl.Marker({ element: el })
      .setLngLat([event.place.lon, event.place.lat])
      .addTo(mapRef.current); // Add marker to the map
  }

  async function initEvents() {
    const fetchEvents = async () => {
      try {
        const data = await getEvent();
        setEvents(Object.values(data.events)); // Convert object to array
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    // Initial fetch and then set interval
    fetchEvents();
  }

  // Update nearby user markers on the map
  useEffect(() => {
    if (mapRef.current) {
      // Remove markers for users who are no longer nearby
      Object.keys(nearbyMarkersRef.current).forEach((userid) => {
        if (!nearbyUsers.find((user) => user.userid === userid)) {
          nearbyMarkersRef.current[userid].remove();
          delete nearbyMarkersRef.current[userid];
        }
      });

      // Add/update markers for current nearby users
      nearbyUsers.forEach((user) => {
        if (!nearbyMarkersRef.current[user.userid]) {
          // Create a new marker for the user
          const el = document.createElement('div');
          el.style.backgroundImage = `url('/cat.jpg')`; // Path to user icon
          el.style.width = '50px';
          el.style.height = '50px';
          el.style.backgroundSize = 'contain';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.borderRadius = '50%';

          const popupContent = `
            <div style="text-align: center; color: black;">
              <p style="color: black;"><strong>User:</strong> ${user.userid}</p>
              <p style="color: black;"><strong>Latitude:</strong> ${user.latitude}</p>
              <p style="color: black;"><strong>Longitude:</strong> ${user.longitude}</p>
            </div>
          `;

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([user.longitude, user.latitude])
            .setPopup(popup)
            .addTo(mapRef.current);

          nearbyMarkersRef.current[user.userid] = marker; // Store the marker in the ref
        }
      });
    }
  }, [nearbyUsers]);

  useEffect(() => {
    let intervalId;
  // Function to make the POST request
  async function postUserPosition(lat, lon,userid) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/updateuserpos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userid,
          lat,
          lon,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('Error posting user position:', data.status);
      }
    } catch (error) {
      console.error('Failed to post user position:', error);
    }
  }
    function updateUserMovement() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserPosition({ lat: latitude, lng: longitude }); // Correct use
            postUserPosition(latitude, longitude,name);

          },
          (error) => console.error('Error retrieving location:', error),
          { enableHighAccuracy: true }
        );
      }
    }
    

    // Initial fetch and then set interval
    updateUserMovement();
    intervalId = setInterval(updateUserMovement, 1000); // Run every 5 seconds

    // Cleanup the interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures it runs only once on mount
  // Generate a random user ID on load

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_API_KEY;

    // Get user's current location
    initializeUserPosition();
    initEvents()

    // Initialize the map
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [11.576, 48.137], // Default center
      zoom: 12,
    });
    map.on('style.load', () => add3DBuildingsLayer(map));

    //add naviation control
    map.addControl(new mapboxgl.NavigationControl());
    map.on('load', () => {
      mapRef.current = map; // Save the map instance

      // Add event markers after the map is loaded
      events.forEach(addEventMarker);
      addUserMarker();
      // Add 3D buildings layer

    });




    // Cleanup on unmount
    return () => {
      if (mapRef.current){
        mapRef.current.remove();}
    };
  }, []);


  useEffect(() => {

    if (mapRef.current) {
      // Add event markers
      events.forEach((event) => {
        addEventMarker(event, mapRef.current);
      });
    }
  }, [events]);
// Define fetchhackatumevent as a const inside the component
const fetchhackatumevent = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/gethackatumevent`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Ensures compatibility with Flask-CORS
      },
    });

    const data = await res.json(); // Parse JSON response

    // // Assuming the event is being displayed as a marker
    // if (data.event && mapRef.current) {
    //   addEventMarker(data.event);
    // }
  } catch (error) {
    console.error('Failed to fetch hackatum event:', error);
  }
};
  useEffect(() => {
    if (mapRef.current) {
      // Add user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove(); // Remove the previous marker
      }
      userMarkerRef.current=addUserMarker();
      if (!mapRef.current.isMoving()) {
        mapRef.current.easeTo({
          center: [userPosition.lng, userPosition.lat],
          duration: 1000, // Smooth transition duration in milliseconds
          easing: (t) => t, // Linear easing for a natural movement
        });
      }
    }
  }, [userPosition]);
  return (
    <div className="h-screen flex flex-col relative">
      {/* Map Container */}
      <div id="map" className="flex-1"></div>

      {/* Logo Overlay */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-24 h-24 object-contain rounded-full"
        />
      </div>

      {showEvent && <EventModal event={curEvent} setShowEvent={setShowEvent} />}
      {/* Scoreboard Overlay */}
      <Scoreboard />
      {/* QR Code Button */}
      <button
        onClick={() => router.push('/scan')}
        className="absolute bottom-2 right-4 z-50 w-16 h-16  p-0 bg-yellow-400 hover:opacity-25"
        style={{ border: 'none', cursor: 'pointer' }}
      >
        <img
          src="/qrcodebutton.png"
          alt="QR Code Button"
          className="w-full h-full object-contain"
        />
      </button>

      <button
  onClick={fetchhackatumevent} // Invoke the function properly
  className="absolute top-5 right-4 z-50 w-8 h-8 pt-3 opacity-20 hover:opacity-25"
  style={{ border: 'none', cursor: 'pointer' }}
>
  <img
    src="/qrcodebutton.png"
    alt="QR Code Button"
    className="w-full h-full object-contain"
  />
</button>


    </div>
  );

}

// Utility Functions



function add3DBuildingsLayer(map) {
  const layers = map.getStyle().layers;
  const labelLayerId = layers.find(
    (layer) => layer.type === 'symbol' && layer.layout['text-field']
  ).id;

  map.addLayer(
    {
      id: 'add-3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'height'],
        ],
        'fill-extrusion-base': [
          'interpolate',
          ['linear'],
          ['zoom'],
          15,
          0,
          15.05,
          ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.6,
      },
    },
    labelLayerId
  );
}




function simulateUserMovement(userMarker, map, setUserPosition) {
  return setInterval(() => {
    setUserPosition((prevPosition) => {
      const newLat = prevPosition.lat + 0.000009;
      const newLng = prevPosition.lng + 0.000010;

      if (isNaN(newLat) || isNaN(newLng)) {
        console.error('Invalid position:', { lat: newLat, lng: newLng });
        return prevPosition;
      }

      const newPosition = { lat: newLat, lng: newLng };

      userMarker.setLngLat([newLng, newLat]);

      // Smoothly update the map's center without affecting zoom or pitch
      if (!map.isMoving()) {
        map.easeTo({
          center: [newLng, newLat],
          duration: 1000, // Smooth transition duration in milliseconds
          easing: (t) => t, // Linear easing for a natural movement
        });
      }

      return newPosition;
    });
  }, 1000);
}

function updateUserMarkerMovement(userMarker, map, setUserPosition) {
  return setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserPosition({ lat: latitude, lng: longitude });

        userMarker.setLngLat([longitude, latitude]);

        // Smoothly update the map's center without affecting zoom or pitch
        if (!map.isMoving()) {
          map.easeTo({
            center: [newLng, newLat],
            duration: 1000, // Smooth transition duration in milliseconds
            easing: (t) => t, // Linear easing for a natural movement
          });
        }
      },
      (error) => console.error('Error retrieving location:', error),
      { enableHighAccuracy: true }
    );
  }, 1000);
}