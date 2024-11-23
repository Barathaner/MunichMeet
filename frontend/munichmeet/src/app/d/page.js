'use client';
import React from 'react';
import { useUserPoints } from '../context/context';
import { useRouter } from 'next/navigation'; // Correct import for App Router

export default function Home() {
  const { points, addPoints, resetPoints } = useUserPoints();
  const router = useRouter();

  const handleSwitchPage = () => {
    router.push('/'); // Navigate to the home page
  };

  // Function to fetch user points from the backend
  async function fetchPoints() {
    try {
      const response = await fetch('/api/points'); // Replace with your API endpoint
      const data = await response.json();
      console.log('Fetched points:', data.points);
      return data.points;
    } catch (error) {
      console.error('Error fetching points:', error);
      return 0;
    }
  }

  return (
    <div>
      <button onClick={handleSwitchPage}>Go to home</button>
      <div>User Points: {points}</div>
    </div>
  );
}
