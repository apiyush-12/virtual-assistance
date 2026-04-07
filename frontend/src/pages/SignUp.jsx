import React, {useContext, useState} from 'react'
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import {useNavigate} from "react-router-dom";
import bg from "../assets/auth2.jpg"
import axios from 'axios';
import { userDataContext } from '../context/userContext.jsx';

function signUp() {
  const [showPassword, setShowPassword] = React.useState(false);
  const{serverUrl,userData, setUserData} = React.useContext(userDataContext);
  const navigate = useNavigate();
  const[name,setName] = React.useState("");
  const[email,setEmail] = React.useState("");
  const [loading, setLoading] = useState(false);
  const[password,setPassword] = React.useState("");
  const [err, setErr] = useState("");
  const handleSignUp = async(e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try{
      let result = await axios.post(`${serverUrl}/api/auth/signup`,{
        name,email,password
      },{withCredentials: true});
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.log("Error signing up:", error);
      setUserData(null);
      setErr(error?.response?.data?.message || "An error occurred during sign up.");
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen" style={{backgroundImage: `url(${bg})`,backgroundSize: "cover",backgroundPosition: "center",backgroundRepeat: "no-repeat",display: "flex",justifyContent: "center",alignItems: "center"}}>
    <form className='w-[90%] h-125 max-w-125 bg-[#00000000] backdrop-blur shadow-lg shadow-blue-950 rounded-lg flex flex-col justify-center items-center gap-5 px-5' onSubmit={handleSignUp}>
        <h1 className='text-white text-[30px] font-semibold mb-7.5'>Register to <span className='text-blue-500'>Virtual Assistant</span></h1>
        <input type="text" placeholder='Enter your name' className='w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-5 py-2 rounded-full text-[18px]' required onChange={(e) => setName(e.target.value)} value={name}/>
        <input type="email" placeholder='Enter your email' className='w-full h-15 outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-5 py-2 rounded-full text-[18px]' required onChange={(e) => setEmail(e.target.value)} value={email} />
        <div className='w-full h-15 border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
            <input type={showPassword ? "text" : "password"} placeholder='Enter your password' className='w-full h-full outline-none border-2 border-white bg-transparent text-white placeholder-grey-300 px-5 py-2 rounded-full text-[18px]' required onChange={(e) => setPassword(e.target.value)} value={password} />
            {!showPassword && (
                <IoIosEye className='absolute right-5 top-4 w-[25px] h-[25px] text-white cursor-pointer' onClick={() => setShowPassword(!showPassword)}/>
            )}
            {showPassword && (
                <IoIosEyeOff className='absolute right-5 top-4 w-[25px] h-[25px] text-white cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
            )}
        </div>
        {err.length > 0 && <p className='text-red-500 text-[16px]'> *{err}</p>}
        <button className='w-[150px] h-15 mt-[30px] bg-blue-500 text-white rounded-full text-[20px] font-semibold hover:bg-blue-600 transition duration-300' disabled={loading}>
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
        <p className='text-white text-[18px]' onClick={()=>navigate("/SignIn")}>Already have an account? <span className='text-blue-500 hover:underline cursor-pointer'>Sign In</span></p>
    </form>
    </div>
  )
}

export default signUp
