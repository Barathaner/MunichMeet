'use client';

import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUserPoints } from './context/context';
import { useRouter } from "next/navigation";
import QrReaderFeedback from './components/QrReaderFeedback';

export default function Home() {
  const router = useRouter();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false); // State to toggle the overlay

  const [userPosition, setUserPosition] = useState({
    lat: null,
    lng: null,
  });
  
  // Get the user points from the context
  const { points, addPoints, resetPoints,name } = useUserPoints();


  const handleswitchapage = () => {
    router.push("/d");
  };


  function initializeMap() {
    if (userPosition.lat == null || userPosition.lng == null) {
      return new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/navigation-night-v1', // Mapbox style URL
        center: [userPosition.lat, userPosition.lng], // Default starting position [lng, lat]
        zoom: 15.5, // Starting zoom
        pitch: 45, // Tilt the map
        bearing: -17.6, // Rotate the map
        antialias: true, // Enables smoother edges for 3D objects
      });
    }
  }

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_API_KEY;

    // Get user's current location
    initializeUserPosition(setUserPosition);
    // Initialize the map
    const map = initializeMap();

    // Add 3D buildings layer
    map.on('style.load', () => add3DBuildingsLayer(map));

    //add naviation control
    map.addControl(new mapboxgl.NavigationControl());


    // Add marker for user's current position
    const userMarker = addUserMarker(map, userPosition);

    // Simulate user movement
    const movementInterval = simulateUserMovement(
      userMarker,
      map,
      setUserPosition
    );

    // Cleanup on unmount
    return () => {
      clearInterval(movementInterval);
      map.remove();
    };
  }, []);

return (
  <div className="h-screen flex flex-col relative">
    {/* Overlay after successful QR reading */}
    {isOverlayVisible && (
      
      <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center the div
        width: '60%', // Adjust width as needed
        height: '60%', // Adjust height as needed
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
        zIndex: 1000, // Ensure it's above the map
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        borderRadius: '15px', // Optional: rounded corners for the overlay
      }}
    >
      <h1 className="text-2xl font-bold">Overlay Content</h1>
      <p>This is the overlay component</p>
      <QrReaderFeedback />
      <button
        onClick={() => setIsOverlayVisible(false)}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Close Overlay
      </button>
    </div>

        )}

    {/* Map Container */}
    <div id="map" className="flex-1"></div>

    {true && (
      <>
        {points} {name}
        <button onClick={() => addPoints(10)}>Add Points</button>
        <button onClick={handleswitchapage}>Switch Page</button>
        <button
          onClick={() => setIsOverlayVisible(true)} // Show overlay
        >
          Show Overlay
        </button>
      </>
    )}

    {/* Logo Overlay */}
    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
      <img
        src="/logo.png"
        alt="Logo"
        className="w-24 h-24 object-contain rounded-full"
      />
    </div>
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

function initializeUserPosition(setUserPosition) {
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

function addUserMarker(map, userPosition) {
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
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>Your Simulated Location</h3>
         <p>Lat: ${userPosition.lat}, Lng: ${userPosition.lng}</p>`
      )
    )
    .addTo(map);
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

function updateUserMovement(userMarker, map, setUserPosition) {
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