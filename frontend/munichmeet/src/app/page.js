'use client';

import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const [count, setCount] = useState(0);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhcmxlc2RlYW4wMDEyIiwiYSI6ImNsdzZ5OTZwcjFveWQyanBodjZkdGEydXYifQ.Qm8HDp_pE5t9nyB9lgE0HA';

    // Initialize the map
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/navigation-night-v1', // Mapbox style URL
      center: [-74.0066, 40.7135], // starting position [lng, lat]
      zoom: 15.5, // starting zoom
      pitch: 45, // tilt the map
      bearing: -17.6, // rotate the map
      antialias: true, // enables smoother edges for 3D objects
    });

    map.addControl(new mapboxgl.NavigationControl());

    // Add 3D buildings layer
    map.on('style.load', () => {
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
    });

    // Add a marker for the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Set map center to the user's location
          map.setCenter([longitude, latitude]);

          // Add a marker at the user's location
          new mapboxgl.Marker({ color: 'blue' })
            .setLngLat([longitude, latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>Your Location</h3>
                 <img src="https://imgs.search.brave.com/LeDanWIHWBgdoQfV2tB84d5JTBsmIoTR09ihoCav_Ic/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjI2/NDY0MTU4L3Bob3Rv/L2NhdC13aXRoLW9w/ZW4tbW91dGguanBn/P3M9NjEyeDYxMiZ3/PTAmaz0yMCZjPVFy/OURDVmt3S21fZHpm/amtlTjVmb0NCcDdj/M0VmQkZfaTJBMGV0/WWlKT0E9" 
                      alt="Location" 
                      style="width: 100%; height: auto; margin-top: 10px;" />
                 <p>Lat: ${latitude}, Lng: ${longitude}</p>`
              )
            )
            .addTo(map);
        },
        (error) => {
          console.error('Error retrieving location:', error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    // Cleanup on component unmount
    return () => map.remove();
  }, []);

  useEffect(() => {
    console.log('Count:', count);
  }, [count]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <p>API Key: {apiKey}</p>
      <button onClick={() => setCount(count + 1)}>Count</button>
      <div id="map" style={{ flex: 1 }}></div>
    </div>
  );
}
