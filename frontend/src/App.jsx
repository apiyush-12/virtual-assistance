import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from './pages/signIn'
import SignUp from './pages/signUp'
import Customize from './pages/customize'
import Customize2 from './pages/Customize2'
import Home from './pages/Home'
import { userDataContext } from './context/userContext'

function App() {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <Home/>: <Navigate to="/customize"/>} />
      <Route path='/signIn' element={!userData ? <SignIn/> : <Navigate to="/" />} />
      <Route path='/signUp' element={!userData ? <SignUp/> : <Navigate to="/" />} />
      <Route path='/customize' element={userData ? <Customize/> : <Navigate to="/signIn" />} />
      <Route path='/customize2' element={userData ? <Customize2/> : <Navigate to="/signIn" />} />
    </Routes>
  )
}


export default App