import React, { use, useEffect, useRef, useContext, useState } from 'react'
import { userDataContext } from '../context/UserContext.jsx';
import { data, useNavigate } from 'react-router-dom';
import axios from 'axios';
import aiImg from '../assets/ai1.gif';
import userImg from '../assets/user2.gif';

function Home() {
  const {userData, serverUrl, setUserData, getGeminiResponse} = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth=window.speechSynthesis;
  const lastCallTimeRef = useRef(0);

  const handleLogout = async () => {
    try{
      const result = await axios.get(`${serverUrl}/api/auth/logout`,{withCredentials: true});
      setUserData(null);
      navigate("/signIn");

    } catch (error) {
      setUserData(null);
      console.log("Error logging out:", error);
    }
  }

  const startRecognition = () => {
    if(!isSpeakingRef.current && !isRecognizingRef.current){
      try{
        recognitionRef.current?.start();
        console.log("Speech recognition started");
    } catch (error) {
      if(!error.message.includes("already started")){
        console.error("Error starting speech recognition:", error);
      }
    }
  }
  }

  const speak=(text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel(); 
    synth.speak(utterance);
  }

  const handleCommand = (data) => {
    const {type, userInput, response} = data;
    speak(response);

    if(type === 'google-search'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if(type === 'calculator-open'){
      window.open(`calculator:`, '_blank');
    }
    if(type === 'youtube-search' || type === 'youtube-open' || type === 'youtube-play'){
      const query = encodeURIComponent(userInput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
    if(type === 'instagram-open'){
      window.open(`https://www.instagram.com/search/?q=${encodeURIComponent(userInput)}`, '_blank');
    }
    if(type === 'weather-show'){
      window.open(`https://www.google.com/search?q=weather+in+${encodeURIComponent(userInput)}`, '_blank');
    }



  }

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;
    const starttimeout = setTimeout(() => {
      if(isMounted && !isRecognizingRef.current && !isSpeakingRef.current){
        try{
          recognition.start();
          console.log("Speech recognition started");
        } catch (error) {
          if (error.name !== 'InvalidStateError') {
            console.error("Error starting speech recognition:", error);
          }
        }
      }
    }, 1000);    


    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if(isMounted && !isSpeakingRef.current){
        setTimeout(() => {
          if(isMounted){
            try{
              recognition.start();
              console.log("Recognition restarted");
            } catch (error) {
              if (error.name !== 'InvalidStateError') {
                console.error("Error restarting speech recognition:", error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if(event.error !== 'aborted' && isMounted && !isSpeakingRef.current){
        setTimeout(() => {
          if(isMounted){
            try{
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (error) {
              if (error.name !== 'InvalidStateError') {
                console.error("Error restarting speech recognition after error:", error);
              }
            }
          }
        }, 1000);
      }
    };

recognition.onresult = async (event) => {
  const now = Date.now();

  // ⛔ prevent too many API calls (3 sec delay)
  if (now - lastCallTimeRef.current < 3000) return;

  lastCallTimeRef.current = now;

  const transcript = event.results[event.results.length - 1][0].transcript.trim();
  console.log('Recognized:', transcript);

  if (transcript.toLowerCase().startsWith(userData.assistantName.toLowerCase())) {
    setAiText("");
    setUserText(transcript);

    recognition.stop();
    isRecognizingRef.current = false;
    setListening(false);

    const data = await getGeminiResponse(transcript);
    console.log("Gemini response:", data);

    handleCommand(data);
    setAiText(data.response);
    setUserText("");
  }
};
    const greetings = [
      `Hello ${userData.name}! How can I assist you today?`,
      `Hi ${userData.name}! What can I do for you?`,
      `Hey ${userData.name}! Need any help?`,
      `Welcome back ${userData.name}! How may I assist you?`
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    greetings.lang = 'hi-IN';
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(randomGreeting));

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    }


  }, []);


  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#030366] flex justify-center items-center flex-col gap-[20px]'>
      <button className='min-w-[150px] h-[50px] mt-[30px] bg-white text-black absolute top-[20px] right-[20px] rounded-full text-[20px] font-semibold hover:bg-blue-600 transition duration-300 cursor-pointer' onClick={handleLogout}>Log Out</button>      
      <button className='min-w-[170px] h-[60px] mt-[30px] bg-white text-black absolute top-[90px] right-[20px] rounded-full text-[20px] font-semibold hover:bg-blue-600 transition duration-300 px-[20px] py-[10px] cursor-pointer' onClick={() => navigate('/customize')}>Customize Your Avatar</button>      
      <div className='w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg'>
        <img src={userData?.assistantImage} className='h-full object-cover' />
      </div>
      <h1 className='text-white text-[30px] mt-[10px] font-semibold'>I'm {userData?.assistantName}</h1>
      {!aiText && <img src={userImg} className='w-[200px] object-cover' />}
      {aiText && <img src={aiImg} className='w-[150px] object-cover' />}
      <h1 className='text-white text-[20px] font-semibold'> {userText? userText : aiText? aiText : null}</h1>

    </div>
  )
}

export default Home;
