import React from 'react'
import { userDataContext } from '../context/userContext.jsx';
import { useContext } from 'react';
import { useState } from 'react';

function Card({ image }) {
    const {serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage} = React.useContext(userDataContext);
    
  return (
    <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] 
    bg-[#030326] border-2 border-[blue] rounded-2xl 
    overflow-hidden shadow-lg shadow-blue-950 
    hover:shadow-blue-400 transition duration-200 
    cursor-pointer hover:border-4 hover:border-white ${selectedImage === image ? "border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={() => {
        setSelectedImage(image)
        setFrontendImage(null)
        setBackendImage(null)
    }}>
      <img src={image} className=' h-full object-cover rounded-2xl' />
    </div>
  )
}

export default Card
