import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react';


export const userDataContext = React.createContext();

function UserContext({ children }) {
  const serverUrl = "http://localhost:8000";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = React.useState(null);
  const [backendImage, setBackendImage] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/current`,
        { withCredentials: true }
      );
      setUserData(result.data);
      console.log("Current user data:", result.data);
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  };

  const getGeminiResponse = async (command) => {
      try{
        const result= await axios.post(`${serverUrl}/api/user/askToAssistant`, {command}, {withCredentials: true});
        return result.data;
      } catch (error) {
        console.error("Error fetching Gemini response:", error);
        throw error;
      }
  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage, getGeminiResponse};

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;