import React, {useEffect} from 'react'
import { Route, Routes } from 'react-router-dom'

import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import BreedAnalytics from '../pages/BreedAnalytics'
import RegisterCattle from '../pages/RegisterCattle'
import CattleProfile from '../pages/CattleProfile'
import VoiceBot from '../pages/VoiceBot'
import VoicebotLogo from '../components/VoiceBotLogo/VoiceBotLogo'
import Marketplace from '../pages/Marketplace'
import Biometric from '../pages/Biometric'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import Signup from '../pages/SignUp'
import Login from '../pages/Login'
import Disease from '../pages/Disease'
import "./i18n";
import Reports from '../pages/Reports'
import MyCattle from '../pages/MyCattle'
import Activity from '../pages/Activity'
import Help from '../pages/Help'
import AdminMarketplace from '../pages/AdminMarketPlace'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/auth'
import ProductDesc from '../pages/ProductDesc'
import VaccinationEvents from '../pages/Vaccination'

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  useEffect(() => {
    if (
        localStorage.getItem("id") &&
        localStorage.getItem("token") &&
        localStorage.getItem("role")
    ){
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem("role")));
    }
  }, []);
  return (
    <div>
      
      <Navbar />
    
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<BreedAnalytics />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/cattle-profile/:id" element={<CattleProfile />} />
        <Route path="/register-cattle" element={<RegisterCattle />} />
        <Route path="/voicebot" element={<VoiceBot />} />
        <Route path="/identify" element={<Biometric/>}/>
        <Route path="/identify/:id" element={<Biometric/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path='/disease' element={<Disease/>}/>
        <Route path="/reports" element={<Reports/>}/>
        <Route path="/my-cattle" element={<MyCattle/>}/>
        <Route path="/activity" element={<Activity/>}/> 
        <Route path="/admin-marketplace" element={<AdminMarketplace/>}/>
        <Route path="/help" element={<Help/>}/>
        <Route path="/product/:id" element={<ProductDesc/>}/>
        <Route path="/vaccination" element={<VaccinationEvents/>}/>
      </Routes>

      <VoicebotLogo/>
      <Footer />
    </div>
  )
}

export default App