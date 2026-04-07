import React from 'react'
import { useContext } from 'react';
import { useState } from 'react';
import { userDataContext } from '../context/UserContext.jsx';
import axios from 'axios';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';



function Customize2() {
    const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
    const[assistantName, setAssistantName] = React.useState(userData?.assistantName || "");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleUpdateAssistant = async () => {
        setLoading(true);
        try{
            let formData = new FormData();
            formData.append("assistantName", assistantName);
            if(backendImage){
                formData.append("assistantImage", backendImage);
            }else{
                formData.append("imageUrl", selectedImage);
            }
            const result = await axios.post(`${serverUrl}/api/user/update`, formData, {withCredentials: true});
            setLoading(false);
            console.log("Assistant updated successfully:", result.data);
            setUserData(result.data);
            navigate("/");
        }catch(error){
            setLoading(false);
            console.log("Error updating assistant name:", error);
        }
    }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#080808] to-[#0707a3d7] flex justify-center items-center flex-col p-[20px] relative '>
        <IoArrowBackCircleOutline className='absolute top-[30px] left-[30px] text-white text-[30px] cursor-pointer w-[60px] h-[60px]' onClick={ ()=> navigate("/customize") }/>
      <h1 className='text-white text-center mb-[40px] text-[40px] font-semibold'>Enter your <span className=' text-blue-400'>Avatar Name</span></h1>
      <input type="text" placeholder='Eg: Lexica' className='w-full max-w-[600px] h-15 outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-5 py-2 rounded-full text-[18px]' required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
      {assistantName && <button className='w-[300px] h-15 mt-[40px] bg-white text-black rounded-full 
      text-[20px] font-semibold hover:bg-blue-600 transition duration-300 
      cursor-pointer'disabled={loading} onClick={() => {handleUpdateAssistant()}}>{!loading? "Finally, Created Your Avatar": "Updating..."}</button>}
    </div>
  )
}

export default Customize2
