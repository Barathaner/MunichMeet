'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useUserPoints } from '../context/context';

const person_name = "Antonia Smith";
const person_photo = "https://img.freepik.com/premium-vector/little-kid-avatar-profile_18591-50928.jpg";
const userPointsAwarded = 10;  

export default function QrReaderFeedback() {
    const { points, addPoints, resetPoints, name } = useUserPoints();
    const [isOverlayVisible, setIsOverlayVisible] = useState(true); // State to toggle the overlay

    return (
        isOverlayVisible && (
            <div className="h-screen flex flex-col relative"
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
                {/* Map Container */}
                <div id="map" className="flex-1"></div>

                {/* Conditional Overlay (Floating on top of the map with proper spacing) */}
                <div
                    style={{
                        position: 'absolute',
                        top: '13%', // Set to control the top margin (e.g., 20%)
                        left: '50%',
                        transform: 'translateX(-50%)', // Center horizontally
                        width: '60%', // Adjust width as needed
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
                        zIndex: 1000, // Ensure it's above the map
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-around', // Space out children vertically
                        alignItems: 'center',
                        color: 'black',
                        borderRadius: '15px', // Optional: rounded corners for the overlay
                        padding: '20px', // Optional: add padding for spacing inside the overlay
                    }}
                >
                    <button
                        onClick={() => setIsOverlayVisible(false)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#007bff', // Blue background
                            border: 'none',
                            borderRadius: '50%', // Rounded shape for close button
                            color: 'white', // White cross for contrast
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px', // Adjust size for cross
                        }}
                    >
                        × {/* Cross Icon */}
                    </button>

                    {/* First Div: Text Content */}
                    <div
                        style={{
                            backgroundColor: '#ffcccc',
                            padding: '20px',
                            textAlign: 'center',
                            marginBottom: '20px',
                            width: '300px',
                            borderRadius: '15px',
                        }}
                    >
                        You are not alone! You just made 1 new friend
                    </div>

                    {/* Second Div: Two Vertical Columns */}
                    <div
                        style={{
                            backgroundColor: '#ccffcc',
                            padding: '20px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '300px',
                            borderRadius: '15px',
                            marginBottom: '20px'
                        }}
                    >
                        {/* Left Column */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>
                                    {person_name}
                                </p>
                            </div>

                            <img
                                src={person_photo}
                                alt="John Doe"
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>

                        {/* Right Column: Instagram Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {/* Instagram Button */}
                            <a
                                href="https://www.instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-block',
                                    width: '30px',
                                    height: '30px',
                                    backgroundImage:
                                        'url("https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png")',
                                    backgroundSize: 'cover',
                                    borderRadius: '50%',
                                }}
                                aria-label="Instagram Profile"
                            ></a>
                        </div>
                    </div>

                    {/* Third Div */}
                    <div
                        style={{
                            backgroundColor: '#ffcccc',
                            padding: '20px',
                            textAlign: 'center',
                            marginBottom: '20px',
                            width: '300px',
                            borderRadius: '15px',
                        }}
                    >
                        You got {points} points!
                    </div>
                </div>
            </div>
        )
    );
}
