'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useUserPoints } from '../context/context';
const person_name = "Antonia Smith";
const person_photo = "https://img.freepik.com/premium-vector/little-kid-avatar-profile_18591-50928.jpg";
const userPointsAwarded = 10;  

export default function QrReaderFeedback() {
    const { points, addPoints, resetPoints,name } = useUserPoints();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh', // Full viewport height to center vertically
          }}>

        <div style={{ backgroundColor: '#ffcccc', padding: '20px', textAlign: 'center', marginBottom: '20px', width: '300px', borderRadius: '15px'}}>
            You are not alone! You just made 1 new friend
        </div>
        {/* Second Div with 2 vertical columns */}
        <div
            style={{
            backgroundColor: '#ccffcc',
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '300px',
            borderRadius: '15px'
            }}
        >
            {/* Left Column */}
            <div style={{ flex: 1, borderRadius: '15px'}}>
                <div style={{ display: 'flex', alignItems: 'left', gap: '10px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>{person_name}</p>
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

            {/* Right Column */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Photo */}
            
            {/* Instagram Button */}
            <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                display: 'inline-block',
                width: '30px',
                height: '30px',
                backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png")',
                backgroundSize: 'cover',
                borderRadius: '50%',
                }}
                aria-label="Instagram Profile"
            ></a>
            </div>
        </div>
        {/* Third div with a floating look */}
        <div
        style={{
          backgroundColor: '#ccccff',
          padding: '20px',
          textAlign: 'center',
          borderRadius: '15px',
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000, // Ensures it appears above other content
        }}
      >
        You got {points} points!
      </div>
        </div>
    );
    }
