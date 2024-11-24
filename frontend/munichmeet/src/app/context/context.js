'use client';

import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserPointsContext = createContext();

// Custom hook to use the context
export const useUserPoints = () => useContext(UserPointsContext);

// Provider component
export const UserPointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);
  const [name, setName] = useState("MunichMeet");
  const [showSuccess, setShowSuccess] = useState(false);

  // Function to add points
  const addPoints = (value) => setPoints((prev) => prev + value);

  // Function to reset points
  const resetPoints = () => setPoints(0);

  return (
    <UserPointsContext.Provider value={{ points, addPoints, resetPoints,name,setShowSuccess,showSuccess }}>
      {children}
    </UserPointsContext.Provider>
  );
};
