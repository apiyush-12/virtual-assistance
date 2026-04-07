import React from 'react'
import Card from '../components/Card'
import assist1 from "../assets/assist1.jpg"
import assist2 from "../assets/assist2.jpg"
import assist3 from "../assets/assist3.webp"
import assist4 from "../assets/assist4.webp"
import assist5 from "../assets/assist5.webp"
import assist6 from "../assets/assist6.webp"
import assist7 from "../assets/assist7.webp"
import { LuImagePlus } from "react-icons/lu";
import { useRef } from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext.jsx';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useContext } from 'react';

function Customize() {
    const {serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage} = React.useContext(userDataContext);
    const navigate = useNavigate();
    const inputImage=useRef();
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setBackendImage(file);
        setFrontendImage(URL.createObjectURL(file));
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#0707a3d7] flex justify-center items-center flex-col p-[20px]'>
        <IoArrowBackCircleOutline className='absolute top-[30px] left-[30px] text-white text-[30px] cursor-pointer w-[60px] h-[60px]' onClick={ ()=> navigate("/") }/>
        <h1 className='text-white text-center mb-[40px] text-[40px] font-semibold'>Choose an <span className=' text-blue-400'>Avatar</span></h1>
        <div className='w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[20px]'>
            <Card image={assist1} />
            <Card image={assist2} />
            <Card image={assist3} />
            <Card image={assist4} />
            <Card image={assist5} />
            <Card image={assist6} />
            <Card image={assist7} />
            <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] 
            bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden 
            shadow-lg shadow-blue-950 
            hover:shadow-blue-400 transition duration-200 cursor-pointer hover:border-4 hover:border-white 
            flex justify-center items-center ${selectedImage === "input" ? "border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={() => {inputImage.current.click()
                setSelectedImage("input")
            }}>
                {!frontendImage && <LuImagePlus className='text-white w-[25px] h-[25px]' />}
                {frontendImage && <img src={frontendImage} alt="Selected Avatar" className='h-full object-cover rounded-2xl' />}
            </div>
            <input type="file" accept='image/*' ref={inputImage} className='hidden' onChange={handleImageChange} />
      </div>
      {selectedImage && <button className='w-[150px] h-15 mt-[40px] bg-white text-black rounded-full text-[20px] font-semibold hover:bg-blue-600 transition duration-300 cursor-pointer' onClick={() => navigate('/customize2')}>Next</button>
}
    </div>
  )
}

export default Customize