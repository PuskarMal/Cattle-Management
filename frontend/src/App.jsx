import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import BreedAnalytics from '../pages/BreedAnalytics'
import RegisterCattle from '../pages/RegisterCattle'
import CattleProfile from '../pages/CattleProfile'
import VoiceBot from '../pages/VoiceBot'
import VoicebotLogo from '../components/VoiceBotLogo/VoiceBotLogo'
import Marketplace from '../pages/Marketplace'

import Home from '../pages/Home'

import "./i18n";

const App = () => {
  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<BreedAnalytics />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/cattle-profile" element={<CattleProfile />} />
        <Route path="/register-cattle" element={<RegisterCattle />} />
        <Route path="/voicebot" element={<VoiceBot />} />
      </Routes>
      <VoicebotLogo/>
      <Footer />

    </div>
  )
}

export default App
